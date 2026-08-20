from datetime import datetime, timezone
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, login_manager


class User(UserMixin, db.Model):
    """
    Core user account model.
    Passwords are stored as a salted+hashed string via werkzeug.
    """
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    scores = db.relationship("Score", backref="user", lazy=True, cascade="all, delete-orphan")
    activities = db.relationship("Activity", backref="user", lazy=True, cascade="all, delete-orphan")

    def set_password(self, password: str):
        """Hash and salt password using pbkdf2:sha256."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        """Verify plaintext password against stored hash."""
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"


@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))
