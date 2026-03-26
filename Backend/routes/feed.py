from flask import Blueprint, jsonify, current_app
from supabase import create_client

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
    """
    try:
        supabase = _get_supabase()
        
        # Fetch all projects ordered by likes descending, then created_at descending.
        result = supabase.table("projects") \
            .select("*") \
            .order("likes", desc=True) \
            .order("created_at", desc=True) \
            .execute()
            
        return jsonify(result.data), 200
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
                "room_type": "Living Room",
                "style": "Minimalist",
                "likes": 1240,
                "views": 5200
            },
            {
                "user_id": user_id,
                "title": "Industrial Loft Kitchen",
                "description": "Exposed brick and steel accents.",
                "image_url": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2000&auto=format&fit=crop",
                "room_type": "Kitchen",
                "style": "Industrial",
                "likes": 890,
                "views": 3100
            },
            {
                "user_id": user_id,
                "title": "Bohemian Sanctuary Bedroom",
                "description": "Warm tones, macrame, and lots of plants.",
                "image_url": "https://images.unsplash.com/photo-1616594039964-406e7d798183?q=80&w=2000&auto=format&fit=crop",
                "room_type": "Bedroom",
                "style": "Bohemian",
                "likes": 2100,
                "views": 8400
            },
            {
                "user_id": user_id,
                "title": "Modern Classic Study",
                "description": "Dark wood shelves mixed with modern seating.",
                "image_url": "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?q=80&w=2000&auto=format&fit=crop",
                "room_type": "Study",
                "style": "Modern Classic",
                "likes": 560,
                "views": 1500
            }
        ]

        result = supabase.table("projects").insert(mock_projects).execute()
        
        return jsonify({"message": "Feed seeded successfully", "count": len(result.data)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
