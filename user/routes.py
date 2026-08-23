from functools import wraps
from flask import render_template, redirect, url_for, flash, request, jsonify
from flask_login import login_required, current_user
from user import user_bp
from user.forms import EditProfileForm
from models import db
from models.user import User
from models.score import Score
from models.activity import Activity


# ---------------------------------------------------------------------------
# Admin Auth Decorator
# ---------------------------------------------------------------------------

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            flash("Access denied. Admin privileges required.", "danger")
            return redirect(url_for("home"))
        return f(*args, **kwargs)
    return decorated_function


# ---------------------------------------------------------------------------
# Profile page
# ---------------------------------------------------------------------------

@user_bp.route("/profile")
@user_bp.route("/profile/<int:user_id>")
@login_required
def profile(user_id=None):
    """
    Displays profile for logged-in user, or for a specific user if requested by Admin:
    username, email, joined date, and a table of all tracked
    games/pages with best score and total tries.
    """
    if user_id is not None and user_id != current_user.id:
        if not current_user.is_admin:
            flash("Access denied. You can only view your own profile.", "danger")
            return redirect(url_for("user.profile"))
        target_user = db.session.get(User, user_id)
        if not target_user:
            flash("User not found.", "warning")
            return redirect(url_for("user.admin"))
    else:
        target_user = current_user

    scores = {s.page_key: s for s in target_user.scores}
    activities = {a.page_key: a for a in target_user.activities}

    # Build a merged view of all pages the user has touched
    all_keys = set(scores.keys()) | set(activities.keys())
    stats = []
    for key in sorted(all_keys):
        stats.append({
            "page_key": key,
            "score": scores[key].score if key in scores else 0,
            "tries": activities[key].tries if key in activities else 0,
        })

    is_own_profile = (target_user.id == current_user.id)
    title = "My Profile" if is_own_profile else f"{target_user.username}'s Profile"

    return render_template(
        "user/profile.html",
        stats=stats,
        target_user=target_user,
        is_own_profile=is_own_profile,
        title=title
    )


# ---------------------------------------------------------------------------
# Admin Management Routes
# ---------------------------------------------------------------------------

@user_bp.route("/admin")
@login_required
@admin_required
def admin():
    """
    Admin Dashboard: List all users, search users by info, view profile, or delete.
    """
    query = request.args.get("q", "").strip()
    if query:
        users = User.query.filter(
            db.or_(
                User.username.ilike(f"%{query}%"),
                User.email.ilike(f"%{query}%")
            )
        ).order_by(User.id.asc()).all()
    else:
        users = User.query.order_by(User.id.asc()).all()

    return render_template("user/admin.html", users=users, query=query, title="Admin Dashboard")


@user_bp.route("/admin/user/<int:user_id>/delete", methods=["POST"])
@login_required
@admin_required
def delete_user(user_id):
    """
    Delete a user by ID. Prevents deleting the primary admin (user ID 1).
    """
    if user_id == 1 or user_id == current_user.id:
        flash("Cannot delete the primary admin account.", "danger")
        return redirect(url_for("user.admin"))

    target_user = db.session.get(User, user_id)
    if not target_user:
        flash("User not found.", "warning")
        return redirect(url_for("user.admin"))

    username = target_user.username
    db.session.delete(target_user)
    db.session.commit()

    flash(f"User '{username}' (ID: {user_id}) has been deleted successfully.", "success")
    return redirect(url_for("user.admin"))



# ---------------------------------------------------------------------------
# Edit profile
# ---------------------------------------------------------------------------

@user_bp.route("/edit", methods=["GET", "POST"])
@login_required
def edit():
    form = EditProfileForm(obj=current_user)

    if form.validate_on_submit():
        # Require current password to authorize any change
        if not current_user.check_password(form.current_password.data):
            flash("Current password is incorrect.", "danger")
            return render_template("user/edit.html", form=form, title="Edit Profile")

        if form.username.data:
            current_user.username = form.username.data
        if form.email.data:
            current_user.email = form.email.data
        if form.new_password.data:
            current_user.set_password(form.new_password.data)

        db.session.commit()
        flash("Profile updated successfully!", "success")
        return redirect(url_for("user.profile"))

    # Pre-fill form with current values on GET
    form.username.data = form.username.data or current_user.username
    form.email.data = form.email.data or current_user.email

    return render_template("user/edit.html", form=form, title="Edit Profile")


# ---------------------------------------------------------------------------
# REST API — called from JavaScript in game/learning pages
# ---------------------------------------------------------------------------

@user_bp.route("/api/score", methods=["POST"])
@login_required
def api_score():
    """
    Update (or create) the user's best score for a page.
    Body JSON: { "page_key": "games/sudoku", "score": 950 }
    Only updates if the new score is higher than the stored best.
    """
    data = request.get_json(force=True)
    page_key = data.get("page_key")
    new_score = data.get("score")

    if not page_key or new_score is None:
        return jsonify({"error": "page_key and score are required"}), 400

    row = Score.query.filter_by(
        user_id=current_user.id, page_key=page_key
    ).first()

    if row:
        if new_score > row.score:
            row.score = new_score
            db.session.commit()
            return jsonify({"status": "updated", "score": row.score})
        return jsonify({"status": "no_change", "score": row.score})
    else:
        row = Score(user_id=current_user.id, page_key=page_key, score=new_score)
        db.session.add(row)
        db.session.commit()
        return jsonify({"status": "created", "score": row.score})


@user_bp.route("/api/tries", methods=["POST"])
@login_required
def api_tries():
    """
    Increment the try counter for a page by 1.
    Body JSON: { "page_key": "games/blackjack" }
    """
    data = request.get_json(force=True)
    page_key = data.get("page_key")

    if not page_key:
        return jsonify({"error": "page_key is required"}), 400

    row = Activity.query.filter_by(
        user_id=current_user.id, page_key=page_key
    ).first()

    if row:
        row.tries += 1
    else:
        row = Activity(user_id=current_user.id, page_key=page_key, tries=1)
        db.session.add(row)

    db.session.commit()
    return jsonify({"status": "ok", "tries": row.tries})
