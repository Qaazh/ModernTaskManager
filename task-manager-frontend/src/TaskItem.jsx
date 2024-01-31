import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function TaskItem({ task, onEdit, setTasks }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:5000/tasks/${task.id}`);
      setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: 2, padding: 2, marginBottom: 2 }}>
      <Typography variant="h6">{task.title}</Typography>
      <Typography variant="body2" color="textSecondary">{task.description}</Typography>
      <Typography variant="body2">Due Date: {task.due_date || 'No due date'}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <IconButton color="primary" onClick={() => onEdit(task)}>
          <EditIcon />
        </IconButton>
        <IconButton color="secondary" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default TaskItem;


