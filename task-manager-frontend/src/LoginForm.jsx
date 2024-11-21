import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box } from '@mui/material';
import { toast } from 'react-toastify';

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!username || !password) {
      toast.error('Username and password cannot be empty.');
      return;
    }

    try {
      // Send login request to backend
      const response = await axios.post('http://127.0.0.1:5000/auth/login', {
        username,
        password,
      });

      // Store the token in localStorage
      localStorage.setItem('access_token', response.data.access_token);

      // Notify the user of a successful login
      toast.success('Logged in successfully!');

      // Call parent function to update the app state
      onLoginSuccess();
    } catch (error) {
      console.error('Login failed:', error);

      // Handle specific HTTP status codes
      if (error.response && error.response.status === 401) {
        toast.error('Invalid credentials. Please try again.');
      } else {
        toast.error('An error occurred during login. Please try again later.');
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Login
      </Button>
    </Box>
  );
}

export default LoginForm;
