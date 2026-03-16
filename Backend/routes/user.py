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
    Get the current user's profile.
    Requires JWT Bearer token in Authorization header.
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
