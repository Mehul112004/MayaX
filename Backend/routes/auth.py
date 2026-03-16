import base64
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from flask import Blueprint, request, jsonify, current_app, g
from supabase import create_client

from middleware.auth_middleware import require_auth
from utils.avatar import generate_initials_avatar, upload_avatar_to_supabase

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


def _get_supabase():
    """Get a Supabase client instance."""
    return create_client(
        current_app.config["SUPABASE_URL"],
        current_app.config["SUPABASE_KEY"],
    )


def _create_jwt(user_id: str) -> str:
    """Create a JWT session token for the given user."""
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=30),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")


def _hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _check_password(password: str, hashed: str) -> bool:
    """Verify a password against its hash."""
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


@auth_bp.route("/signup", methods=["POST"])
def signup():
    """
    Register a new user with email and password.

    Expects JSON: { "email": "...", "password": "..." }
    Returns: { "token": "<jwt>", "user": {...} }
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    supabase = _get_supabase()

    # Check if email already exists
    existing = (
        supabase.table("users")
        .select("id")
        .eq("email", email)
        .execute()
    )

    if existing.data and len(existing.data) > 0:
        return jsonify({"error": "An account with this email already exists"}), 409

    # Create user
    password_hash = _hash_password(password)
    new_user = {
        "email": email,
        "password_hash": password_hash,
        "is_onboarded": False,
    }

    result = supabase.table("users").insert(new_user).execute()
    user = result.data[0]

    # Don't send password_hash to client
    user.pop("password_hash", None)

    token = _create_jwt(user["id"])
    return jsonify({"token": token, "user": user}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Log in with email and password.

    Expects JSON: { "email": "...", "password": "..." }
    Returns: { "token": "<jwt>", "user": {...} }
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    supabase = _get_supabase()

    result = (
        supabase.table("users")
        .select("*")
        .eq("email", email)
        .execute()
    )

    if not result.data or len(result.data) == 0:
        return jsonify({"error": "Invalid email or password"}), 401

    user = result.data[0]

    if not _check_password(password, user.get("password_hash", "")):
        return jsonify({"error": "Invalid email or password"}), 401

    # Don't send password_hash to client
    user.pop("password_hash", None)

    token = _create_jwt(user["id"])
    return jsonify({"token": token, "user": user}), 200


@auth_bp.route("/complete-profile", methods=["POST"])
@require_auth
def complete_profile():
    """
    Complete user onboarding with additional details.

    Expects JSON or multipart form:
      - name (required): Full name
      - phone (optional): Phone number
      - image (optional): Base64-encoded image string

    If no image is provided, generates an initials-based avatar.
    """
    supabase = _get_supabase()
    user_id = g.user_id

    # Support both JSON and form-data
    if request.content_type and "multipart/form-data" in request.content_type:
        name = request.form.get("name", "").strip()
        phone = request.form.get("phone", "").strip()
        image_file = request.files.get("image")
        image_base64 = None
    else:
        data = request.get_json() or {}
        name = data.get("name", "").strip()
        phone = data.get("phone", "").strip()
        image_file = None
        image_base64 = data.get("image_base64")

    if not name:
        return jsonify({"error": "Name is required"}), 400

    # Handle avatar
    if image_file:
        image_bytes = image_file.read()
        content_type = image_file.content_type or "image/png"
        avatar_url = upload_avatar_to_supabase(supabase, image_bytes, user_id, content_type)
    elif image_base64:
        image_bytes = base64.b64decode(image_base64)
        avatar_url = upload_avatar_to_supabase(supabase, image_bytes, user_id, "image/png")
    else:
        # Generate default initials avatar
        image_bytes = generate_initials_avatar(name)
        avatar_url = upload_avatar_to_supabase(supabase, image_bytes, user_id, "image/png")

    # Update user in database
    update_data = {
        "name": name,
        "phone": phone,
        "avatar_url": avatar_url,
        "is_onboarded": True,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }

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
        "message": "Profile completed successfully",
        "user": user,
    }), 200
