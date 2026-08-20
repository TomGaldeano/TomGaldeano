from flask import render_template, redirect, url_for, flash, request, jsonify
from flask_login import login_required, current_user
from user import user_bp
from user.forms import EditProfileForm
from models import db
from models.score import Score
from models.activity import Activity


# ---------------------------------------------------------------------------
# Profile page
# ---------------------------------------------------------------------------

@user_bp.route("/profile")
@login_required
def profile():
    """
    Displays the logged-in user's profile:
    username, email, joined date, and a table of all tracked
    games/pages with best score and total tries.
    """
    scores = {s.page_key: s for s in current_user.scores}
    activities = {a.page_key: a for a in current_user.activities}

    # Build a merged view of all pages the user has touched
    all_keys = set(scores.keys()) | set(activities.keys())
    stats = []
    for key in sorted(all_keys):
        stats.append({
            "page_key": key,
            "score": scores[key].score if key in scores else 0,
            "tries": activities[key].tries if key in activities else 0,
        })

    return render_template("user/profile.html", stats=stats, title="My Profile")


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
