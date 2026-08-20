from flask import render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required, current_user
from auth import auth_bp
from auth.forms import RegisterForm, LoginForm
from models import db
from models.user import User


@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("home"))

    form = RegisterForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash("Account created! You can now log in.", "success")
        return redirect(url_for("auth.login"))

    return render_template("auth/register.html", form=form, title="Register")


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("home"))

    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user)
            # Redirect to the page user was trying to access, or profile
            next_page = request.args.get("next")
            flash(f"Welcome back, {user.username}!", "success")
            return redirect(next_page or url_for("user.profile"))
        else:
            flash("Invalid email or password.", "danger")

    return render_template("auth/login.html", form=form, title="Login")


@auth_bp.route("/logout")
@login_required
def logout():
    logout_user()
    flash("You have been logged out.", "info")
    return redirect(url_for("home"))
