from flask import Blueprint

user_bp = Blueprint("user", __name__, url_prefix="/user")

from user import routes  # noqa: E402, F401 — import routes to register them
