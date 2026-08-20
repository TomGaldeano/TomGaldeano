from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo, Length, ValidationError
from models.user import User


class RegisterForm(FlaskForm):
    username = StringField(
        "Username",
        validators=[DataRequired(), Length(min=3, max=80)],
        render_kw={"placeholder": "Choose a username"},
    )
    email = StringField(
        "Email",
        validators=[DataRequired(), Email()],
        render_kw={"placeholder": "your@email.com"},
    )
    password = PasswordField(
        "Password",
        validators=[DataRequired(), Length(min=8)],
        render_kw={"placeholder": "Min 8 characters"},
    )
    confirm_password = PasswordField(
        "Confirm Password",
        validators=[DataRequired(), EqualTo("password", message="Passwords must match")],
        render_kw={"placeholder": "Repeat password"},
    )
    submit = SubmitField("Create Account")

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError("That username is already taken.")

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError("An account with that email already exists.")


class LoginForm(FlaskForm):
    email = StringField(
        "Email",
        validators=[DataRequired(), Email()],
        render_kw={"placeholder": "your@email.com"},
    )
    password = PasswordField(
        "Password",
        validators=[DataRequired()],
        render_kw={"placeholder": "Your password"},
    )
    submit = SubmitField("Sign In")
