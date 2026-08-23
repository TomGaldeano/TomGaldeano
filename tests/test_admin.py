import unittest
from flask import Flask
from flask_login import login_user
from config import Config
from models import db, login_manager
import models.user  # noqa: F401
import models.score # noqa: F401
import models.activity # noqa: F401
from models.user import User
from models.score import Score
from models.activity import Activity
from auth import auth_bp
from user import user_bp


from flask_bootstrap import Bootstrap
from flask_wtf.csrf import CSRFProtect

class TestAdminConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    WTF_CSRF_ENABLED = False
    SECRET_KEY = "test-secret-key"


def create_test_app():
    app = Flask(__name__, template_folder="../templates")
    app.config.from_object(TestAdminConfig)

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

    @app.route("/")
    def home():
        return "Home Page"

    @app.route("/games")
    def games():
        return "Games Page"

    return app


class AdminTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_test_app()
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()

        db.create_all()

        # Create Admin (id 1)
        self.admin = User(id=1, username="admin_user", email="admin@example.com")
        self.admin.set_password("adminpass")
        db.session.add(self.admin)

        # Create Regular User (id 2)
        self.user2 = User(id=2, username="alice", email="alice@example.com")
        self.user2.set_password("userpass")
        db.session.add(self.user2)

        # Create Regular User (id 3)
        self.user3 = User(id=3, username="bob", email="bob@example.com")
        self.user3.set_password("userpass")
        db.session.add(self.user3)

        # Add score and activity for Alice
        s = Score(user_id=2, page_key="games/sudoku", score=500)
        a = Activity(user_id=2, page_key="games/sudoku", tries=3)
        db.session.add_all([s, a])

        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def login_as(self, user):
        with self.client.session_transaction() as sess:
            sess['_user_id'] = str(user.id)
            sess['_fresh'] = True

    def test_is_admin_property(self):
        self.assertTrue(self.admin.is_admin)
        self.assertFalse(self.user2.is_admin)
        self.assertFalse(self.user3.is_admin)

    def test_unauthenticated_access(self):
        response = self.client.get("/user/admin", follow_redirects=True)
        self.assertIn(b"Access denied. Admin privileges required.", response.data)

    def test_non_admin_access_denied(self):
        self.login_as(self.user2)
        response = self.client.get("/user/admin", follow_redirects=True)
        self.assertIn(b"Access denied. Admin privileges required.", response.data)

    def test_admin_access_granted(self):
        self.login_as(self.admin)
        response = self.client.get("/user/admin")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Admin Control Panel", response.data)
        self.assertIn(b"admin_user", response.data)
        self.assertIn(b"alice", response.data)
        self.assertIn(b"bob", response.data)

    def test_user_search(self):
        self.login_as(self.admin)

        # Search for alice
        res = self.client.get("/user/admin?q=alice")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"alice", res.data)
        self.assertNotIn(b"bob@example.com", res.data)

        # Search by email domain
        res2 = self.client.get("/user/admin?q=example.com")
        self.assertIn(b"alice", res2.data)
        self.assertIn(b"bob", res2.data)

    def test_admin_view_user_profile(self):
        self.login_as(self.admin)

        # View Alice's profile (user_id 2)
        res = self.client.get("/user/profile/2")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"Inspecting profile for user", res.data)
        self.assertIn(b"alice", res.data)
        self.assertIn(b"games/sudoku", res.data)
        self.assertIn(b"500", res.data)

    def test_non_admin_cannot_view_other_profile(self):
        self.login_as(self.user2)

        # Alice tries to view Bob's profile
        res = self.client.get("/user/profile/3", follow_redirects=True)
        self.assertIn(b"Access denied. You can only view your own profile.", res.data)

    def test_admin_delete_user(self):
        self.login_as(self.admin)

        # Delete user ID 3 (bob)
        res = self.client.post("/user/admin/user/3/delete", follow_redirects=True)
        self.assertIn(b"User &#39;bob&#39; (ID: 3) has been deleted successfully.", res.data)

        # Verify bob is deleted from DB
        bob = db.session.get(User, 3)
        self.assertIsNone(bob)

    def test_admin_cannot_delete_primary_admin(self):
        self.login_as(self.admin)

        # Attempt to delete admin user (ID 1)
        res = self.client.post("/user/admin/user/1/delete", follow_redirects=True)
        self.assertIn(b"Cannot delete the primary admin account.", res.data)

        # Verify admin is still in DB
        admin_user = db.session.get(User, 1)
        self.assertIsNotNone(admin_user)


if __name__ == "__main__":
    unittest.main()
