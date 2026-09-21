import unittest
from flask import Flask, render_template
from config import Config
from models import db, login_manager
import models.user  # noqa: F401
import models.score  # noqa: F401
import models.activity  # noqa: F401
from flask_bootstrap import Bootstrap
from flask_wtf.csrf import CSRFProtect
from auth import auth_bp
from user import user_bp


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    WTF_CSRF_ENABLED = False
    SECRET_KEY = "test-secret-key"


def create_test_app():
    app = Flask(__name__, template_folder="../templates", static_folder="../static")
    app.config.from_object(TestConfig)

    Bootstrap(app)
    CSRFProtect(app)
    db.init_app(app)
    login_manager.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)

    @app.context_processor
    def inject_user():
        from flask_login import current_user
        return dict(current_user=current_user)

    # Core navigation routes
    @app.route('/')
    def home():
        return "Home"

    @app.route('/clock')
    def clock():
        return "Clock"

    @app.route('/personal')
    def personal():
        return "Personal"

    @app.route('/ordered')
    def ordered():
        return "Ordered"

    @app.route('/games')
    def games():
        return render_template('games.html')

    @app.route('/games/bottleSort')
    def bottleSort():
        return render_template('games/bottleSort.html')

    # Register stub routes so url_for in games.html works
    game_routes = [
        'tresenraya', 'sudoku', 'blackjack', 'solitaire', 'buscaminas',
        'adivinaNum', 'hexKingdom', 'obstacleRun', 'spaceInvaders', 'tute'
    ]
    for r in game_routes:
        app.add_url_rule(f'/games/{r}', endpoint=r, view_func=lambda r=r: f"Stub for {r}")

    return app


class BottleSortTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_test_app()
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_games_list_contains_bottle_sort(self):
        response = self.client.get('/games')
        self.assertEqual(response.status_code, 200)
        content = response.get_data(as_text=True)
        self.assertIn('Water Sort (Bottle Filling)', content)
        self.assertIn('/games/bottleSort', content)

    def test_bottle_sort_route_renders(self):
        response = self.client.get('/games/bottleSort')
        self.assertEqual(response.status_code, 200)
        content = response.get_data(as_text=True)
        self.assertIn('Water Sort Puzzle', content)
        self.assertIn('id="bottleCanvas"', content)
        self.assertIn('bottleSort.js', content)
        self.assertIn('btnUndo', content)
        self.assertIn('btnRestart', content)
        self.assertIn('btnNewGame', content)


if __name__ == '__main__':
    unittest.main()
