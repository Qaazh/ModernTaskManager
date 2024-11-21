# **Task Manager**

A **modern task management application** designed for individuals and teams to efficiently organize, track, and manage their daily tasks. Built using **React** for the frontend and **Flask** with **SQLAlchemy** for the backend, this application integrates authentication, filtering, and sorting functionalities for an enhanced user experience.

---

## **Features**

- **User Authentication**:
  - Secure login and registration with JWT-based token authentication.
  - Ensures tasks are private and linked to individual users.

- **Task Management**:
  - Add tasks with titles, descriptions, and due dates.
  - Edit or delete tasks as needed.
  - Mark tasks as complete, with visual cues for completed tasks.

- **Search, Filter, and Sort**:
  - Search tasks by title for quick navigation.
  - Filter tasks by status: All, Completed, or Incomplete.
  - Sort tasks by due date or title.

- **Responsive Design**:
  - A sleek and intuitive user interface built with **Material-UI** for a professional and responsive look.

- **Data Persistence**:
  - Backend powered by **Flask** and **SQLAlchemy** with a relational database (**SQLite**) to ensure secure storage and management of user data.

- **Feedback System**:
  - Real-time notifications for task operations (e.g., task added, edited, or deleted) using **react-toastify**.

---

## **Technologies Used**

### **Frontend**:
- **React**: Component-based user interface.
- **Axios**: Simplified HTTP requests.
- **Material-UI**: Modern design framework for React.
- **React Toastify**: Toast notifications for user feedback.

### **Backend**:
- **Flask**: Lightweight Python web framework.
- **Flask-JWT-Extended**: Secure user authentication with JWT.
- **SQLAlchemy**: Object-relational mapping (ORM) for database interactions.
- **SQLite**: Lightweight relational database.

---

## **Setup and Installation**

### **Prerequisites**
- Python 3.8+
- Node.js 16+

### **Backend Setup**
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/task-manager.git
   cd task-manager/backend 
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt 
3. Initialize the database:
   ```bash
   flask db init
   flask db migrate
   flask db upgrade 
4. Run the Flask server:
    ```bash
   flask run 

### **Frontend Setup**
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend 
2. Install dependencies:
   ```bash
   npm install 
3. Start the development server:
   ```bash
   npm start 
4. Access the application at http://localhost:3000

## **Usage**

### **1. Register and Login**
- Create a new account or log in with an existing one.
- All tasks are tied to the logged-in user.

### **2. Manage Tasks**
- Add new tasks with a title, description, and optional due date.
- Mark tasks as completed to keep track of progress.
- Edit or delete tasks as needed.

### **3. Organize with Filters and Sort**
- Filter tasks by status or search for specific tasks.
- Sort tasks by due date or title for easy prioritization.

## **Screenshots**

### **Login Page**
<!-- ![Login Page](screenshots/login.png) -->!

### **Task Dashboard**
<!-- ![Task Dashboard](screenshots/dashboard.png) -->!

---

## **Future Enhancements**
- Add task categories or tags for better organization.
- Implement collaborative task sharing for teams.
- Add a calendar view for deadline visualization.

---

## **Contributing**
Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name 
3. Commit your changes:
   ``` bash
   git commit -m "Add your message here" 
4. Push to your branch:
   ``` bash
   git push origin feature-name 
5. Create pull request
