from flask import Blueprint, jsonify, current_app
from supabase import create_client

preferences_bp = Blueprint("preferences", __name__, url_prefix="/preferences")


def _get_supabase():
    """Get a Supabase client instance."""
    return create_client(
        current_app.config["SUPABASE_URL"],
        current_app.config["SUPABASE_KEY"],
    )


@preferences_bp.route("/", methods=["GET"])
def get_preferences():
    """
    Fetch all active preference categories ordered by sort_order.
    """
    try:
        supabase = _get_supabase()
        result = supabase.table("camera_preference_categories") \
            .select("*") \
            .eq("is_active", True) \
            .order("sort_order") \
            .execute()
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@preferences_bp.route("/seed", methods=["POST"])
def seed_preferences():
    """
    Seed the camera_preference_categories table with initial categories.
    """
    try:
        supabase = _get_supabase()
        
        # Check if already seeded
        existing = supabase.table("camera_preference_categories").select("id").limit(1).execute()
        if existing.data and len(existing.data) > 0:
            return jsonify({"message": "camera_preference_categories table already seeded."}), 200

        mock_data = [
            {
                "category_name": "Colors",
                "display_label": "Colors",
                "icon_name": "color-palette-outline",
                "options": ["Minimal & Calm", "Bold & Vibrant", "Elegant & Dark", "Warm & Earthy", "Cool & Coastal", "Monochrome"],
                "sort_order": 1,
                "is_active": True
            },
            {
                "category_name": "Aesthetics",
                "display_label": "Aesthetics",
                "icon_name": "sparkles-outline",
                "options": ["Minimal", "Modern & Classic", "Royal & Inheritage", "Bohemian", "Industrial", "Scandinavian"],
                "sort_order": 2,
                "is_active": True
            },
            {
                "category_name": "SpaceType",
                "display_label": "Space Type",
                "icon_name": "home-outline",
                "options": ["Bedroom", "Living Room", "Kitchen", "Bathroom", "Office / Study", "Patio / Balcony"],
                "sort_order": 3,
                "is_active": True
            }
        ]

        result = supabase.table("camera_preference_categories").insert(mock_data).execute()
        
        return jsonify({"message": "Preferences seeded successfully", "count": len(result.data)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
