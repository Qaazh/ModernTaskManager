import React, { useState, useEffect } from 'react';
import axios from './axiosConfig'; // Use the configured Axios instance
import TaskItem from './TaskItem';
import { MenuItem, FormControl, Select, InputLabel, Box, TextField, Typography, Paper } from '@mui/material';
import { toast } from 'react-toastify';

function TaskList({ tasks, setTasks, onEdit }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('dueDate');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Fetch tasks with authentication
        const response = await axios.get('/tasks');
        setTasks(response.data || []); // Ensure response is an array
        toast.success('Tasks fetched successfully!');
      } catch (error) {
        console.error('Error fetching tasks:', error);

        if (error.response && error.response.status === 401) {
          toast.error('Unauthorized. Please log in again.');
        } else {
          setError('Failed to fetch tasks. Please try again later.');
          toast.error('Failed to fetch tasks.', {
            icon: '❌',
            style: { backgroundColor: '#f8d7da', color: '#721c24' },
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [setTasks]);

  // Filter tasks based on user selection
  const filteredTasks = (tasks || []).filter((task) => {
    if (!task || !task.id) return false; // Skip invalid tasks
    if (filter === 'completed') return task.completed; // Show only completed tasks
    if (filter === 'incomplete') return !task.completed; // Show only incomplete tasks
    if (filter === 'all') return !task.completed; // Main page excludes completed tasks
    if (searchTerm) return task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return true;
  });

  // Sort tasks based on user selection
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'dueDate') {
      return (a.due_date || '') > (b.due_date || '') ? 1 : -1;
    } else if (sort === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
      {error && <Typography color="error">{error}</Typography>}

      {/* Search Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2, alignItems: 'center' }}>
        <TextField
          label="Search Tasks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            flex: 2,
            backgroundColor: 'white',
            borderRadius: 1,
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        />
      </Box>

      {/* Filter Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
          Filter Tasks
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="filter-label" shrink sx={{ fontWeight: 'bold' }}></InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{
              backgroundColor: 'white',
              borderRadius: 1,
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <MenuItem value="all">All (Incomplete Only)</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="incomplete">Incomplete</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Sort Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
          Sort Tasks
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="sort-label" shrink sx={{ fontWeight: 'bold' }}></InputLabel>
          <Select
            labelId="sort-label"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            sx={{
              backgroundColor: 'white',
              borderRadius: 1,
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <MenuItem value="dueDate">Due Date</MenuItem>
            <MenuItem value="title">Title</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Task List */}
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : sortedTasks.length > 0 ? (
        sortedTasks.map((task) => (
          <TaskItem key={task.id} task={task} onEdit={onEdit} setTasks={setTasks} />
        ))
      ) : (
        <Typography>No tasks available</Typography>
      )}
    </Paper>
  );
}

export default TaskList;
