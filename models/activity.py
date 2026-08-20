from models import db


class Activity(db.Model):
    """
    Tracks cumulative tries (attempts) a user has made on a specific game or page.
    page_key matches the URL path, e.g. 'games/blackjack'.
    One row per (user_id, page_key) pair — tries is incremented each attempt.
    """
    __tablename__ = "activities"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    page_key = db.Column(db.String(120), nullable=False)   # e.g. "games/blackjack"
    tries = db.Column(db.Integer, nullable=False, default=0)

    __table_args__ = (
        db.UniqueConstraint("user_id", "page_key", name="uq_user_page_activity"),
    )

    def __repr__(self):
        return f"<Activity user={self.user_id} page={self.page_key} tries={self.tries}>"
