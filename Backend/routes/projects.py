from flask import Blueprint, request, jsonify, current_app, g
from supabase import create_client
from middleware.auth_middleware import require_auth
from utils.storage import upload_image_to_supabase
from utils.inference import run_design_inference
import traceback

projects_bp = Blueprint("projects", __name__, url_prefix="/projects")

def _get_supabase():
    """Get a Supabase client instance."""
    return create_client(
        current_app.config["SUPABASE_URL"],
        current_app.config["SUPABASE_KEY"],
    )

@projects_bp.route("/generate", methods=["POST"])
@require_auth
def generate_project():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image part in the request"}), 400
            
        file = request.files["image"]
        prompt = request.form.get("prompt", "")
        # Get secure user_id from token
        user_id = g.user_id
        
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400
            
        image_bytes = file.read()
        content_type = file.mimetype
        
        supabase = _get_supabase()
        
        # 1. Upload Original Image
        original_image_url = upload_image_to_supabase(
            supabase=supabase,
            bucket_name="projects",
            image_bytes=image_bytes,
            user_id=user_id,
            content_type=content_type,
        )
        
        # 2. Insert into DB
        project_data = {
            "user_id": user_id,
            "title": prompt[:30] + "..." if len(prompt) > 30 else prompt,
            "description": prompt,
            "original_image": original_image_url,
            "image_url": original_image_url
        }
        
        response = supabase.table("projects").insert(project_data).execute()
        
        if not response.data:
            return jsonify({"error": "Failed to create project record"}), 500
            
        project_id = response.data[0]["id"]
        
        # 3. Call inference (returns bytes from API)
        generated_image_bytes = run_design_inference(original_image_url, prompt)
        
        # 4. Upload generated preview into Supabase projects bucket
        final_preview_url = upload_image_to_supabase(
            supabase=supabase,
            bucket_name="projects",
            image_bytes=generated_image_bytes,
            user_id=user_id,
            content_type="image/png",
        )
        
        return jsonify({
            "project_id": project_id,
            "original_image": original_image_url,
            "generated_image_url": final_preview_url,
            "message": "Design generated successfully."
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@projects_bp.route("/<project_id>/save", methods=["POST"])
@require_auth
def save_project(project_id):
    try:
        data = request.get_json()
        final_image_url = data.get("final_image_url")
        
        if not final_image_url:
            return jsonify({"error": "Missing final_image_url"}), 400
            
        supabase = _get_supabase()
        
        update_response = supabase.table("projects").update(
            {"image_url": final_image_url}
        ).eq("id", project_id).execute()
        
        if not update_response.data:
            return jsonify({"error": "Failed to update project image"}), 500
            
        return jsonify({
            "project_id": project_id,
            "message": "Project saved successfully."
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

