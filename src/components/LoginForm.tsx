import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  Container,
  Snackbar,
  Alert,
} from '@mui/material';
import Header from './Header';
import styles from './LoginForm.module.css';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;

    // Reset errors
    setUsernameError(false);
    setPasswordError(false);

    // Validate username
    if (username.trim() === '') {
      setUsernameError(true);
      setErrorMessage('Username is required');
      isValid = false;
    }

    // Validate password
    if (password.trim() === '') {
      setPasswordError(true);
      setErrorMessage('Password is required');
      isValid = false;
    }

    if (!isValid) {
      setSnackbarOpen(true); // Show error message
    }

    return isValid;
  };

  const handleLogin = () => {
    if (!validateForm()) return; // Validate form before proceeding

    const storedUser = localStorage.getItem(username);

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.password === password) {
        // If user exists and password matches, log them in
        dispatch(loginUser(username));
        localStorage.setItem('loggedInUser', username);
        navigate('/tasks');
      } else {
        setErrorMessage('Invalid credentials');
        setSnackbarOpen(true); // Show snackbar with error message
      }
    } else {
      // If user does not exist, register them by saving the credentials to localStorage
      const newUser = { username, password };
      localStorage.setItem(username, JSON.stringify(newUser));
      dispatch(loginUser(username)); // Log in the new user immediately
      localStorage.setItem('loggedInUser', username);
      navigate('/tasks');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Header />
      <Container maxWidth="xs" className={styles.container}>
        <Paper elevation={3} className={styles.paper}>
          <Typography variant="h4" gutterBottom align="center" className={styles.heading}>
            Login
          </Typography>
          <Box component="form" className={styles.form}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={usernameError} // Highlight the field in red when there's an error
              helperText={usernameError && 'Username is required'} // Show helper text for validation
              InputProps={{
                classes: { root: styles.textField },
              }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError} // Highlight the field in red when there's an error
              helperText={passwordError && 'Password is required'} // Show helper text for validation
              InputProps={{
                classes: { root: styles.textField },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              className={styles.button}
              onClick={handleLogin}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Snackbar for error alert */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginForm;
