from flask import Flask, render_template, redirect, url_for, request, Response
from flask_bootstrap import Bootstrap
import werkzeug.security
from functools import wraps
from flask_wtf.csrf import CSRFProtect
import time


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

@app.route('/clock')
def clock():
    return render_template('clock.html',hope_graduation="2027-06-19",birth30="2028-01-24")

@app.route('/projects/personal')
def pj_personal():
    return render_template('projects/pj_personal.html')

@app.route('/projects/personal/div_showcase')
def pj_per_div():
    return render_template('projects/pj_per_div.html')

@app.route('/projects/personal/built_in_api_showcase')
def pj_per_built_in_api():
    return render_template('projects/pj_per_built_in_api.html')

@app.route('/projects/games')
def pj_games():
    return render_template('projects/pj_games.html')

@app.route('/projects/games/sudoku')
def sudoku():
    return render_template('games/sudoku.html')

@app.route('/projects/games/tresenraya')
def tresenraya():
    return render_template('games/tresenraya.html')

@app.route('/projects/games/buscaminas')
def buscaminas():
    return render_template('games/buscaminas.html')

@app.route('/projects/ordered')
def pj_ordered():
    return render_template('projects/pj_ordered.html')

@app.route('/projects/operaciones')
def pj_operaciones():
    return render_template('projects/sistemas_informaticos/operaciones.html')

@app.route('/projects/gestion')
def pj_gestion():
    return render_template('projects/sistemas_informaticos/gestion.html',options="ABCDE")  

if __name__ == '__main__':  
    app.run(host='0.0.0.0', port=5001, debug=True)


