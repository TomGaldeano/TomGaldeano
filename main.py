from flask import Flask, render_template, redirect, url_for, request
from flask_bootstrap import Bootstrap
import werkzeug.security
from functools import wraps
from flask_wtf.csrf import CSRFProtect


def create_app():
    """
    Creates framework for it website to run (blackbox)
    """
    global app
    app = Flask(__name__)
    Bootstrap(app)
    app.config['SECRET_KEY'] = "gdfgsksdflsdfjfdswksjfkdsjfksjkfjdls"
    csrf = CSRFProtect(app)
    return app

create_app()

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')


if __name__ == '__main__':
    app.run(debug=True)
