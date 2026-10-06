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
        flash("¡Cuenta creada! Ya puedes iniciar sesión.", "success")
        return redirect(url_for("auth.login"))

    return render_template("auth/register.html", form=form, title="Registrarse")


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
            flash(f"¡Bienvenido de nuevo, {user.username}!", "success")
            return redirect(next_page or url_for("user.profile"))
        else:
            flash("Correo electrónico o contraseña incorrectos.", "danger")

    return render_template("auth/login.html", form=form, title="Iniciar sesión")


@auth_bp.route("/logout")
@login_required
def logout():
    logout_user()
    flash("Has cerrado sesión correctamente.", "info")
    return redirect(url_for("home"))
