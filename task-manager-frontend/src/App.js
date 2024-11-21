import React, { useState } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import LoginForm from './LoginForm'; // Registration component
import SignupForm from './SignupForm'; // Registration component
import { Fab, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
  const [showSignup, setShowSignup] = useState(false);

  const addTask = (newTask) => {
    setTasks((prevTasks) => {
      if (taskToEdit) {
        toast.info('Task updated successfully!', {
          icon: '🔄',
          style: { backgroundColor: '#d1ecf1', color: '#0c5460' },
        });
        return prevTasks.map((task) => (task.id === newTask.id ? newTask : task));
      } else {
        toast.success('Task added successfully!', {
          icon: '✅',
          style: { backgroundColor: '#d4edda', color: '#155724' },
        });
        return [newTask, ...prevTasks];
      }
    });
    setShowForm(false);
    setTaskToEdit(null);
  };

  const editTask = (task) => {
    setTaskToEdit(task);
    setShowForm(true);
  };

  const cancelEdit = () => {
    setTaskToEdit(null);
    setShowForm(false);
  };

  const handleFabClick = () => {
    setShowForm((prevState) => !prevState);
    setTaskToEdit(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    toast.success('Logged out successfully!');
  };

  if (!isLoggedIn) {
    return (
      <Box>
        <ToastContainer />
        {showSignup ? (
          <SignupForm onSignupSuccess={() => setShowSignup(false)} />
        ) : (
          <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
        )}
        <Button onClick={() => setShowSignup(!showSignup)}>
          {showSignup ? 'Already have an account? Login' : 'Don’t have an account? Signup'}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <ToastContainer />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <h1>Task Manager</h1>
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <TaskList tasks={tasks} onEdit={editTask} setTasks={setTasks} />
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleFabClick}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>
      {showForm && (
        <TaskForm
          taskToEdit={taskToEdit}
          onSubmit={addTask}
          onCancelEdit={cancelEdit}
        />
      )}
    </Box>
  );
}

export default App;
