import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, selectUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css'; // CSS Module for styles

const Header: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };

  return (
    <AppBar position="sticky" className={styles.appBar}>
      <Container maxWidth="lg">
        <Toolbar className={styles.toolbar}>
          <Typography variant="h5" className={styles.title}>
            Task Manager
          </Typography>
          {user && (
            <Button variant="contained" className={styles.logoutButton} onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
