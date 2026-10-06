from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo, Length, ValidationError
from models.user import User


class RegisterForm(FlaskForm):
    username = StringField(
        "Nombre de usuario",
        validators=[DataRequired(), Length(min=3, max=80)],
        render_kw={"placeholder": "Elige un nombre de usuario"},
    )
    email = StringField(
        "Correo electrónico",
        validators=[DataRequired(), Email()],
        render_kw={"placeholder": "tu@correo.com"},
    )
    password = PasswordField(
        "Contraseña",
        validators=[DataRequired(), Length(min=8)],
        render_kw={"placeholder": "Mínimo 8 caracteres"},
    )
    confirm_password = PasswordField(
        "Confirmar contraseña",
        validators=[DataRequired(), EqualTo("password", message="Las contraseñas deben coincidir")],
        render_kw={"placeholder": "Repite la contraseña"},
    )
    submit = SubmitField("Crear cuenta")

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError("Ese nombre de usuario ya está en uso.")

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError("Ya existe una cuenta con ese correo electrónico.")


class LoginForm(FlaskForm):
    email = StringField(
        "Correo electrónico",
        validators=[DataRequired(), Email()],
        render_kw={"placeholder": "tu@correo.com"},
    )
    password = PasswordField(
        "Contraseña",
        validators=[DataRequired()],
        render_kw={"placeholder": "Tu contraseña"},
    )
    submit = SubmitField("Iniciar sesión")
