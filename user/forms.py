from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import Optional, Email, Length, EqualTo, ValidationError
from flask_login import current_user
from models.user import User


class EditProfileForm(FlaskForm):
    username = StringField(
        "Username",
        validators=[Length(min=3, max=80)],
        render_kw={"placeholder": "New username"},
    )
    email = StringField(
        "Email",
        validators=[Optional(), Email()],
        render_kw={"placeholder": "New email"},
    )
    new_password = PasswordField(
        "New Password",
        validators=[Optional(), Length(min=8)],
        render_kw={"placeholder": "Leave blank to keep current"},
    )
    confirm_password = PasswordField(
        "Confirm New Password",
        validators=[Optional(), EqualTo("new_password", message="Passwords must match")],
        render_kw={"placeholder": "Repeat new password"},
    )
    current_password = PasswordField(
        "Current Password (required to save changes)",
        validators=[],
        render_kw={"placeholder": "Enter your current password"},
    )
    submit = SubmitField("Save Changes")

    def validate_username(self, username):
        if username.data and username.data != current_user.username:
            user = User.query.filter_by(username=username.data).first()
            if user:
                raise ValidationError("That username is already taken.")

    def validate_email(self, email):
        if email.data and email.data != current_user.email:
            user = User.query.filter_by(email=email.data).first()
            if user:
                raise ValidationError("That email is already registered.")
