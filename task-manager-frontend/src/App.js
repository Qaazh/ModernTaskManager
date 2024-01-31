import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import { Fab, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const addTask = (newTask) => {
    setTasks(prevTasks => {
      if (taskToEdit) {
        // Update the existing task
        return prevTasks.map(task => (task.id === newTask.id ? newTask : task));
      } else {
        // Add a new task
        return [newTask, ...prevTasks]; // Add to the beginning
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
    setShowForm(prevState => !prevState);
    setTaskToEdit(null);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <h1>Task Manager</h1>
      <TaskList tasks={tasks} onEdit={editTask} setTasks={setTasks} />
      <Fab color="primary" aria-label="add" onClick={handleFabClick} sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <AddIcon />
      </Fab>

      {showForm && (
        <TaskForm taskToEdit={taskToEdit} onSubmit={addTask} onCancelEdit={cancelEdit} />
      )}
    </Box>
  );
}

export default App;



