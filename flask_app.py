from flask import Flask, render_template, redirect, url_for, request, Response
from flask_bootstrap import Bootstrap
from flask_wtf.csrf import CSRFProtect
from config import Config
from models import db, login_manager



def create_app():
    """
    Application factory.
    Creates and configures the Flask app, initialises extensions,
    registers blueprints, and ensures database tables exist.
    """
    app = Flask(__name__)
    app.config.from_object(Config)
    Bootstrap(app)
    CSRFProtect(app)
    db.init_app(app)
    login_manager.init_app(app)
    from auth import auth_bp
    from user import user_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    with app.app_context():
        try:
            import pymysql
            connection = pymysql.connect(
                host=app.config['DB_HOST'],
                port=int(app.config['DB_PORT']),
                user=app.config['DB_USER'],
                password=app.config['DB_PASSWORD']
            )
            with connection.cursor() as cursor:
                cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{app.config['DB_NAME']}` CHARACTER SET utf8mb4;")
            connection.close()
        except Exception as e:
            print(f"Warning: Could not auto-create database '{app.config['DB_NAME']}': {e}")

        try:
            db.create_all()
        except Exception as e:
            print(f"Warning: Could not create tables: {e}")

    return app


app = create_app()


@app.context_processor
def inject_user():
    from flask_login import current_user
    return dict(current_user=current_user)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/clock')
def clock():
    return render_template('clock.html', hope_graduation="2027-06-19", birth30="2028-01-24")

#
## PERSONAL
#

@app.route('/personal')
def personal():
    return render_template('personal.html')

@app.route('/personal/div_showcase')
def divShow():
    return render_template('personal/div_show.html')

@app.route('/personal/built_in_api_showcase')
def built_in_api():
    return render_template('personal/built_in_api.html')

@app.route('/personal/operacionesBinarias')
def operacionesBinarias():
    return render_template('personal/sistemas_informaticos/operaciones.html')

@app.route('/personal/gestion')
def gestionProcesos():
    return render_template('personal/sistemas_informaticos/gestion.html', options="ABCDE")

@app.route('/personal/CssChallenges')
def CssChallenges():
    return render_template("personal/css_challenges.html")

#
## GAMES
#

@app.route('/games')
def games():
    return render_template('games.html')

@app.route('/games/sudoku')
def sudoku():
    return render_template('games/sudoku.html')

@app.route('/games/tresenraya')
def tresenraya():
    return render_template('games/tresenraya.html')

@app.route('/games/blackjack')
def blackjack():
    return render_template('/games/blackjack.html')

@app.route('/games/buscaminas')
def buscaminas():
    return render_template('games/buscaminas.html')

@app.route('/games/adivinaNum')
def adivinaNum():
    return render_template('games/adivinaNum.html')

@app.route('/games/hexKingdom')
def hexKingdom():
    return render_template('games/hexKingdoms.html')

@app.route('/games/obstacleRun')
def obstacleRun():
    return render_template('games/obstacleRun.html')

@app.route('/games/spaceInvaders')
def spaceInvaders():
    return render_template('games/spaceInvaders.html')

@app.route('/games/tute')
def tute():
    return render_template('games/tute.html')

@app.route("/games/solitaire")
def solitaire():
    return render_template("/games/solitaire.html")

@app.route("/games/bottleSort")
def bottleSort():
    return render_template("games/bottleSort.html")

#
## ORDERED
#

@app.route('/ordered')
def ordered():
    return render_template('ordered.html')

@app.route('/ordered/PracticaBackup')
def practicaBackup():
    return render_template('ordered/Backup.html')

@app.route("/ordered/AzureSands")
def AzureSands():
    return render_template("/ordered/AzureSands.html")

@app.route('/ordered/BananaTracker.html')
def BananaTracker():
    return render_template("/ordered/BananaTracker.html")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
