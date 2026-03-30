from flask import Blueprint, jsonify, current_app
from supabase import create_client

design_bp = Blueprint("design", __name__, url_prefix="/design")


def _get_supabase():
    """Get a Supabase client instance."""
    return create_client(
        current_app.config["SUPABASE_URL"],
        current_app.config["SUPABASE_KEY"],
    )


@design_bp.route("/", methods=["GET"])
def get_designs():
    """
    Fetch all designs from the database.
    """
    try:
        supabase = _get_supabase()
        result = supabase.table("designs").select("*").execute()
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@design_bp.route("/seed", methods=["POST"])
def seed_designs():
    """
    Seed the designs table with mock images.
    """
    try:
        supabase = _get_supabase()
        
        # Check if already seeded
        existing = supabase.table("designs").select("id").limit(1).execute()
        if existing.data and len(existing.data) > 0:
            return jsonify({"message": "Designs table already seeded."}), 200

        mock_designs = [
            {"title": "Modern Living Room", "image": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop", "color_scheme": "Minimal & Calm", "aesthetics": "Modern & Classic", "space_type": "Living Room"},
            {"title": "Cozy Bedroom Retreat", "image": "https://images.unsplash.com/photo-1622429420441-60dd67f737a6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "color_scheme": "Warm & Earthy", "aesthetics": "Bohemian", "space_type": "Bedroom"},
            {"title": "Minimalist Kitchen", "image": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2000&auto=format&fit=crop", "color_scheme": "Monochrome", "aesthetics": "Minimal", "space_type": "Kitchen"},
            {"title": "Bohemian Patio", "image": "https://images.unsplash.com/photo-1622763846204-5d0bf5031e06?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "color_scheme": "Bold & Vibrant", "aesthetics": "Bohemian", "space_type": "Patio / Balcony"},
            {"title": "Scandinavian Office", "image": "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?q=80&w=2000&auto=format&fit=crop", "color_scheme": "Cool & Coastal", "aesthetics": "Scandinavian", "space_type": "Office / Study"},
            {"title": "Rustic Dining Area", "image": "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=2000&auto=format&fit=crop", "color_scheme": "Warm & Earthy", "aesthetics": "Royal & Inheritage", "space_type": "Living Room"},
        ]

        result = supabase.table("designs").insert(mock_designs).execute()
        
        return jsonify({"message": "Designs seeded successfully", "count": len(result.data)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
