from datetime import datetime, timezone
from models import db


class Score(db.Model):
    """
    Tracks the best score a user has achieved on a specific game or page.
    page_key matches the URL path, e.g. 'games/sudoku', 'personal/gestion'.
    One row per (user_id, page_key) pair — updated in-place when a new best is set.
    """
    __tablename__ = "scores"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    page_key = db.Column(db.String(120), nullable=False)   # e.g. "games/sudoku"
    score = db.Column(db.Integer, nullable=False, default=0)
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    __table_args__ = (
        db.UniqueConstraint("user_id", "page_key", name="uq_user_page_score"),
    )

    def __repr__(self):
        return f"<Score user={self.user_id} page={self.page_key} score={self.score}>"
