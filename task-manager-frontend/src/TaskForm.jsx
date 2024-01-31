import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box } from '@mui/material';

function TaskForm({ taskToEdit, onSubmit, onCancelEdit }) {
  const [title, setTitle] = useState(taskToEdit ? taskToEdit.title : '');
  const [description, setDescription] = useState(taskToEdit ? taskToEdit.description : '');
  const [dueDate, setDueDate] = useState(taskToEdit ? taskToEdit.due_date : '');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setDueDate(taskToEdit.due_date);
    }
  }, [taskToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        title,
        description,
        due_date: dueDate
      };

      if (taskToEdit) {
        const response = await axios.put(`http://127.0.0.1:5000/tasks/${taskToEdit.id}`, taskData);
        onSubmit(response.data);
      } else {
        const response = await axios.post('http://127.0.0.1:5000/tasks', taskData);
        onSubmit(response.data);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving task:', error);
      setError('Failed to save task. Please try again later.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    onCancelEdit();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={4}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Due Date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: new Date().toISOString().split('T')[0], // Restrict to today's date and future dates
        }}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>
        {taskToEdit ? 'Update Task' : 'Add Task'}
      </Button>
      <Button variant="outlined" color="secondary" onClick={resetForm}>
        Cancel
      </Button>
    </Box>
  );
}

export default TaskForm;


