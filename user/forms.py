from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import Optional, Email, Length, EqualTo, ValidationError
from flask_login import current_user
from models.user import User


class EditProfileForm(FlaskForm):
    username = StringField(
        "Nombre de usuario",
        validators=[Length(min=3, max=80)],
        render_kw={"placeholder": "Nuevo nombre de usuario"},
    )
    email = StringField(
        "Correo electrónico",
        validators=[Optional(), Email()],
        render_kw={"placeholder": "Nuevo correo electrónico"},
    )
    new_password = PasswordField(
        "Nueva contraseña",
        validators=[Optional(), Length(min=8)],
        render_kw={"placeholder": "Dejar en blanco para mantener la actual"},
    )
    confirm_password = PasswordField(
        "Confirmar nueva contraseña",
        validators=[Optional(), EqualTo("new_password", message="Las contraseñas deben coincidir")],
        render_kw={"placeholder": "Repite la nueva contraseña"},
    )
    current_password = PasswordField(
        "Contraseña actual (requerida para guardar cambios)",
        validators=[],
        render_kw={"placeholder": "Introduce tu contraseña actual"},
    )
    submit = SubmitField("Guardar cambios")

    def validate_username(self, username):
        if username.data and username.data != current_user.username:
            user = User.query.filter_by(username=username.data).first()
            if user:
                raise ValidationError("Ese nombre de usuario ya está en uso.")

    def validate_email(self, email):
        if email.data and email.data != current_user.email:
            user = User.query.filter_by(email=email.data).first()
            if user:
                raise ValidationError("Ese correo electrónico ya está registrado.")
