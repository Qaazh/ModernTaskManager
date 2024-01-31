from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Import CORS
import os
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/tasks/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///task.db'  # SQLite database file
db = SQLAlchemy(app)
app.static_folder = '../task-manager-frontend/build/static'


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    due_date = db.Column(db.Date)
    completed = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)


@app.route('/')
def index():
    return render_template('index.html')  # Render an index.html template


# GET /tasks: Retrieves all tasks from the database and returns them as a JSON array
@app.route('/tasks', methods=['GET'])
def get_task():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])


# POST /tasks: Creates a new task based on the JSON data sent in the request body
@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()

    if 'due_date' in data:  # Check if due_date is provided
        due_date_str = data['due_date']
        try:
            due_date = datetime.strptime(due_date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid due_date format (YYYY-MM-DD)"}), 400
    else:
        due_date = None  # Set due_date to None if not provided

    new_task = Task(
        title=data['title'],
        description=data.get('description'),
        due_date=due_date  # Use the converted due_date or None
    )

    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201



# GET /tasks/<task_id>: Retrieves a single task by its ID. Returns a 404 error if not found.
@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_taskbyID(task_id):
    task = Task.query.get_or_404(task_id)
    return jsonify(task.to_dict())


# PUT /tasks/<task_id>: Updates an existing task by its ID with the data from the request body
@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()
    task.title = data['title']
    task.description = data.get('description')

    # Convert due_date string to datetime object if it exists
    due_date_str = data.get('due_date')
    if due_date_str:
        task.due_date = datetime.strptime(due_date_str, "%Y-%m-%d").date()

    # Only update the completed field if it is in the data
    if 'completed' in data:
        task.completed = data['completed']

    db.session.commit()
    return jsonify(task.to_dict())


# DELETE /tasks/<task_id>: Deletes a task by its ID
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
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
    app.run(debug=True)
