from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Enable CORS for frontend-backend communication
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from datetime import datetime

app = Flask(__name__)

# Enable Cross-Origin Resource Sharing for all routes
#CORS(app, resources={r"/tasks/*": {"origins": "*"}, r"/auth/*": {"origins": "*"}})
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure SQLite database file
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///task.db'
app.config['SECRET_KEY'] = 'your_secret_key'  # Secret key for Flask
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Secret key for JWT authentication
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Define the Task model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    due_date = db.Column(db.Date)
    completed = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # Foreign key linking to User model

# Define the User model for authentication
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    tasks = db.relationship('Task', backref='user', lazy=True)

# Render the frontend index.html template
@app.route('/')
def index():
    return render_template('index.html')  # Render an index.html template

# User Authentication Endpoints
# POST /auth/register: Registers a new user by storing their username and hashed password
@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify(message="User registered successfully"), 201

# POST /auth/login: Logs in a user and returns a JWT token if credentials are valid
@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    return jsonify(message="Invalid credentials"), 401

# GET /tasks: Retrieves all tasks for the logged-in user
@app.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()
    tasks = Task.query.filter_by(user_id=user_id).all()
    return jsonify([task.to_dict() for task in tasks])

# POST /tasks: Creates a new task for the logged-in user
@app.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    user_id = get_jwt_identity()
    data = request.get_json()

    print("Received Data:", data)  # Log the incoming data for debugging

    if 'title' not in data or not data['title']:
        return jsonify({"error": "Title is required"}), 422

    if 'due_date' in data:  # Check if due_date is provided
        due_date_str = data['due_date']
        try:
            due_date = datetime.strptime(due_date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid due_date format (YYYY-MM-DD)"}), 422
    else:
        due_date = None  # Set due_date to None if not provided

    new_task = Task(
        title=data['title'],
        description=data.get('description'),
        due_date=due_date,
        user_id=user_id
    )

    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201

# GET /tasks/<task_id>: Retrieves a single task by its ID for the logged-in user
@app.route('/tasks/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task_by_id(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()
    return jsonify(task.to_dict())

# PUT /tasks/<task_id>: Updates an existing task by its ID for the logged-in user
@app.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()
    data = request.get_json()
    task.title = data['title']
    task.description = data.get('description')

    # Update due_date if provided
    if 'due_date' in data:
        task.due_date = datetime.strptime(data['due_date'], "%Y-%m-%d").date()

    # Update completed status if provided
    if 'completed' in data:
        task.completed = data['completed']

    db.session.commit()
    return jsonify(task.to_dict())

# DELETE /tasks/<task_id>: Deletes a task by its ID for the logged-in user
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted successfully'}), 200

# Add a to_dict() method to the Task model for serialization
def to_dict(self):
    return {
        'id': self.id,
        'title': self.title,
        'description': self.description,
        'due_date': self.due_date.isoformat() if self.due_date else None,
        'completed': self.completed
    }

Task.to_dict = to_dict  # Assign the function to the model

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Ensure database tables are created
    app.run(debug=True)
