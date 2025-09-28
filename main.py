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

@app.route('/programacion/css')
def prog_css():
    return render_template('prog/prog_css.html')

@app.route('/programacion/html')
def prog_html():
    return render_template('prog/prog_html.html')

@app.route('/programacion/js')
def prog_js():
    return render_template('prog/prog_js.html')

@app.route('/programacion/php')
def prog_php():
    return render_template('prog/prog_php.html')

@app.route('/programacion/python')
def prog_python():
    return render_template('prog/prog_python.html')

@app.route('/programacion/sql')
def prog_sql():
    return render_template('prog/prog_sql.html')

@app.route('/programacion/java')
def prog_java():
    return render_template('prog/prog_java.html')

@app.route('/programacion/c')
def prog_c():
    return render_template('prog/prog_c.html')

@app.route('/programacion/bash')
def prog_bash():
    return render_template('prog/prog_bash.html')

@app.route('/programacion/git')
def prog_git():
    return render_template('prog/prog_git.html')
    
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

@app.route('/projects/ordered')
def pj_ordered():
    return render_template('projects/pj_ordered.html')

@app.route('/computer_science/linux')
def cs_linux():
    return render_template('cs_linux.html')

@app.route("/stream")
def stream():
    def event_stream():
        while True:
            time.sleep(2)  # simulate new data every 2 sec
            yield f"data: {time.strftime('%H:%M:%S')}\n\n"
    return Response(event_stream(), mimetype="text/event-stream")

if __name__ == '__main__':  
    app.run(host='0.0.0.0', port=5001, debug=True)


