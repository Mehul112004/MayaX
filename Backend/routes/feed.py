from flask import Blueprint, jsonify, request, current_app, g
from supabase import create_client

from middleware.auth_middleware import require_auth

feed_bp = Blueprint("feed", __name__, url_prefix="/feed")


def _get_supabase():
    """Get a Supabase client instance."""
    return create_client(
        current_app.config["SUPABASE_URL"],
        current_app.config["SUPABASE_KEY"],
    )


@feed_bp.route("/foryou", methods=["GET"])
def get_for_you_feed():
    """
    Fetch trending and recent projects for the 'For You' feed.
    Ordered primarily by likes, then by created_at.
    Joins user info (name, avatar_url) for creator display.
    """
    try:
        supabase = _get_supabase()
        
        result = supabase.table("projects") \
            .select("*, user:users(id, name, avatar_url)") \
            .order("likes", desc=True) \
            .order("created_at", desc=True) \
            .execute()
            
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@feed_bp.route("/project/<project_id>", methods=["GET"])
@require_auth
def get_project_details(project_id):
    """
    Fetch a single project with user info and whether the current user has liked it.
    """
    try:
        supabase = _get_supabase()
        user_id = g.user_id

        # Fetch project with creator info
        result = supabase.table("projects") \
            .select("*, user:users(id, name, avatar_url)") \
            .eq("id", project_id) \
            .execute()

        if not result.data:
            return jsonify({"error": "Project not found"}), 404

        project = result.data[0]

        # Check if the current user has liked this project
        liked_result = supabase.table("inspirations") \
            .select("id") \
            .eq("user_id", user_id) \
            .eq("project_id", project_id) \
            .execute()

        project["is_liked"] = len(liked_result.data) > 0

        return jsonify(project), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@feed_bp.route("/seed", methods=["POST"])
def seed_feed():
    """
    Seed mock projects with likes to test the 'For You' feed.
    """
    try:
        supabase = _get_supabase()
        
        # We need a user_id to insert projects. Let's fetch the first user
        users = supabase.table("users").select("id").limit(1).execute()
        
        if not users.data:
            return jsonify({"error": "No users found in database to attach mock projects to. Please create a user first."}), 400
            
        user_id = users.data[0]["id"]

        mock_projects = [
            {
                "user_id": user_id,
                "title": "Minimalist Dream",
                "description": "A spacious, clean design utilizing natural light.",
                "image_url": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop",
                "original_image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
                "room_type": "Living Room",
                "style": "Minimalist",
                "color_scheme": "Minimal & Calm",
                "likes": 1240,
                "views": 5200
            },
            {
                "user_id": user_id,
                "title": "Industrial Loft Kitchen",
                "description": "Exposed brick and steel accents.",
                "image_url": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2000&auto=format&fit=crop",
                "original_image": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2000&auto=format&fit=crop",
                "room_type": "Kitchen",
                "style": "Industrial",
                "color_scheme": "Monochrome",
                "likes": 890,
                "views": 3100
            },
            {
                "user_id": user_id,
                "title": "Bohemian Sanctuary Bedroom",
                "description": "Warm tones, macrame, and lots of plants.",
                "image_url": "https://images.unsplash.com/photo-1616594039964-406e7d798183?q=80&w=2000&auto=format&fit=crop",
                "original_image": "https://images.unsplash.com/photo-1616594039964-406e7d798183?q=80&w=2000&auto=format&fit=crop",
                "room_type": "Bedroom",
                "style": "Bohemian",
                "color_scheme": "Warm & Earthy",
                "likes": 2100,
                "views": 8400
            },
            {
                "user_id": user_id,
                "title": "Modern Classic Study",
                "description": "Dark wood shelves mixed with modern seating.",
                "image_url": "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?q=80&w=2000&auto=format&fit=crop",
                "original_image": "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?q=80&w=2000&auto=format&fit=crop",
                "room_type": "Study",
                "style": "Modern Classic",
                "color_scheme": "Elegant & Dark",
                "likes": 560,
                "views": 1500
            }
        ]

        result = supabase.table("projects").insert(mock_projects).execute()
        
        return jsonify({"message": "Feed seeded successfully", "count": len(result.data)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
