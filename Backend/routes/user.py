import base64
from datetime import datetime, timezone

from flask import Blueprint, request, jsonify, current_app, g
from supabase import create_client

from middleware.auth_middleware import require_auth
from utils.avatar import upload_avatar_to_supabase

user_bp = Blueprint("user", __name__, url_prefix="/user")


def _get_supabase():
    """Get a Supabase client instance."""
    return create_client(
        current_app.config["SUPABASE_URL"],
        current_app.config["SUPABASE_KEY"],
    )


@user_bp.route("/profile", methods=["GET"])
@require_auth
def get_profile():
    """
    Get the current user's profile with computed stats.
    Returns stats: { projects, inspirations }
    """
    supabase = _get_supabase()
    user_id = g.user_id

    result = (
        supabase.table("users")
        .select("*")
        .eq("id", user_id)
        .execute()
    )

    if not result.data:
        return jsonify({"error": "User not found"}), 404

    user = result.data[0]
    user.pop("password_hash", None)

    # Count user's projects
    projects_result = (
        supabase.table("projects")
        .select("id", count="exact")
        .eq("user_id", user_id)
        .execute()
    )
    projects_count = projects_result.count or 0

    # Count user's inspirations (liked projects)
    inspirations_result = (
        supabase.table("inspirations")
        .select("id", count="exact")
        .eq("user_id", user_id)
        .execute()
    )
    inspirations_count = inspirations_result.count or 0

    user["stats"] = {
        "projects": projects_count,
        "inspirations": inspirations_count,
    }

    return jsonify({"user": user}), 200


@user_bp.route("/profile", methods=["PUT"])
@require_auth
def update_profile():
    """
    Update user profile. Only name and avatar can be updated.

    Accepts JSON:
      - name (optional): New display name
      - image_base64 (optional): Base64-encoded new avatar image

    Or multipart/form-data:
      - name (optional): New display name
      - image (optional): Image file
    """
    supabase = _get_supabase()
    user_id = g.user_id

    update_data = {"updated_at": datetime.now(timezone.utc).isoformat()}

    if request.content_type and "multipart/form-data" in request.content_type:
        name = request.form.get("name")
        image_file = request.files.get("image")

        if name is not None:
            update_data["name"] = name.strip()

        if image_file:
            image_bytes = image_file.read()
            content_type = image_file.content_type or "image/png"
            avatar_url = upload_avatar_to_supabase(supabase, image_bytes, user_id, content_type)
            update_data["avatar_url"] = avatar_url
    else:
        data = request.get_json() or {}

        if "name" in data:
            update_data["name"] = data["name"].strip()

        if "image_base64" in data:
            image_bytes = base64.b64decode(data["image_base64"])
            avatar_url = upload_avatar_to_supabase(supabase, image_bytes, user_id, "image/png")
            update_data["avatar_url"] = avatar_url

    if len(update_data) <= 1:
        return jsonify({"error": "No fields to update. Provide 'name' or 'image'."}), 400

    result = (
        supabase.table("users")
        .update(update_data)
        .eq("id", user_id)
        .execute()
    )

    if not result.data:
        return jsonify({"error": "User not found"}), 404

    user = result.data[0]
    user.pop("password_hash", None)
    return jsonify({
        "message": "Profile updated successfully",
        "user": user,
    }), 200


# ── Projects ──────────────────────────────────────────────

@user_bp.route("/projects", methods=["GET"])
@require_auth
def get_projects():
    """Get the current user's projects, newest first."""
    supabase = _get_supabase()
    user_id = g.user_id

    result = (
        supabase.table("projects")
        .select("*, inspirations(count)")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    # Format output to lift count safely
    projects = []
    for row in result.data:
        # Supabase returns related count as a list with a single dict: [{'count': X}]
        raw_insp = row.pop("inspirations", [])
        likes = raw_insp[0].get("count", 0) if len(raw_insp) > 0 else 0
        
        row["likes_count"] = likes
        projects.append(row)

    return jsonify({"data": projects}), 200


# ── Inspirations (liked projects from other users) ───────

@user_bp.route("/inspirations", methods=["GET"])
@require_auth
def get_inspirations():
    """
    Get projects liked/saved by the current user.
    Returns the project data joined through the inspirations table.
    """
    supabase = _get_supabase()
    user_id = g.user_id

    result = (
        supabase.table("inspirations")
        .select("id, created_at, project:projects(id, title, description, image_url, room_type, style, user_id, created_at, inspirations(count))")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    inspirations_list = []
    for row in result.data:
        project_data = row.get("project", {})
        if project_data:
            raw_insp = project_data.pop("inspirations", [])
            likes = raw_insp[0].get("count", 0) if len(raw_insp) > 0 else 0
            project_data["likes_count"] = likes
            
        inspirations_list.append(row)

    return jsonify({"data": inspirations_list}), 200


@user_bp.route("/inspirations", methods=["POST"])
@require_auth
def save_inspiration():
    """
    Like/save a project as inspiration.
    Expects JSON: { "project_id": "<uuid>" }
    """
    supabase = _get_supabase()
    user_id = g.user_id

    data = request.get_json() or {}
    project_id = data.get("project_id")

    if not project_id:
        return jsonify({"error": "project_id is required"}), 400

    # Don't allow users to like their own projects
    project_check = (
        supabase.table("projects")
        .select("user_id")
        .eq("id", project_id)
        .execute()
    )

    if not project_check.data:
        return jsonify({"error": "Project not found"}), 404

    if project_check.data[0]["user_id"] == user_id:
        return jsonify({"error": "Cannot like your own project"}), 400

    try:
        result = (
            supabase.table("inspirations")
            .insert({"user_id": user_id, "project_id": project_id})
            .execute()
        )
        return jsonify({"message": "Inspiration saved", "data": result.data[0]}), 201
    except Exception as e:
        if "duplicate" in str(e).lower() or "unique" in str(e).lower():
            return jsonify({"error": "Already saved as inspiration"}), 409
        return jsonify({"error": str(e)}), 500


@user_bp.route("/inspirations/<project_id>", methods=["DELETE"])
@require_auth
def remove_inspiration(project_id):
    """Remove a project from the user's inspirations (unlike)."""
    supabase = _get_supabase()
    user_id = g.user_id

    result = (
        supabase.table("inspirations")
        .delete()
        .eq("user_id", user_id)
        .eq("project_id", project_id)
        .execute()
    )

    if not result.data:
        return jsonify({"error": "Inspiration not found"}), 404

    return jsonify({"message": "Inspiration removed"}), 200
