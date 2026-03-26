from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from routes.auth import auth_bp
from routes.user import user_bp
from routes.design import design_bp
from routes.preferences import preferences_bp
from routes.feed import feed_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for the React Native client
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Register route blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(design_bp)
    app.register_blueprint(preferences_bp)
    app.register_blueprint(feed_bp)

    @app.route("/health", methods=["GET"])
    def health_check():
        return jsonify({"status": "ok", "service": "MayaX API"}), 200

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5001, debug=True)
