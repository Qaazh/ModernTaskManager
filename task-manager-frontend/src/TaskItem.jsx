import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import axios from './axiosConfig'; // Use the configured Axios instance
import { toast } from 'react-toastify';

function TaskItem({ task, onEdit, setTasks }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`/tasks/${task.id}`);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
      toast.error('Task deleted successfully!', {
        icon: '🗑️',
        style: { backgroundColor: '#ffedea', color: '#d9534f' },
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete the task. Please try again.', {
        icon: '❌',
        style: { backgroundColor: '#f8d7da', color: '#721c24' },
      });
    }
  };

  const handleComplete = async () => {
    try {
      await axios.put(`/tasks/${task.id}`, {
        ...task,
        completed: true,
      });
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? { ...t, completed: true } : t))
      );
      toast.success('Task marked as completed!', {
        icon: '✅',
        style: { backgroundColor: '#d4edda', color: '#155724' },
      });
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to mark the task as completed. Please try again.', {
        icon: '❌',
        style: { backgroundColor: '#f8d7da', color: '#721c24' },
      });
    }
  };

  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: 2,
        padding: 2,
        marginBottom: 2,
        backgroundColor: task.completed ? '#d4edda' : '#fff', // Light green if completed
        transition: 'background-color 0.3s', // Smooth transition effect
      }}
    >
      <Typography
        variant="h6"
        sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
      >
        {task.title}
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
      >
        {task.description}
      </Typography>
      <Typography variant="body2">Due Date: {task.due_date || 'No due date'}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        {!task.completed && (
          <Tooltip title="Mark as Completed">
            <IconButton color="success" onClick={handleComplete}>
              <CheckIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Edit Task">
          <IconButton color="primary" onClick={() => onEdit(task)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Task">
          <IconButton color="secondary" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default TaskItem;




