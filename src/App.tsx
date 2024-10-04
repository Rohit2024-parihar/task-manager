import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import LoginForm from './components/LoginForm';
import TaskManager from './components/TaskManager';
import { selectUser } from './store/slices/authSlice';

const App: React.FC = () => {
  const user = useSelector(selectUser);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to="/tasks" /> : <LoginForm />} 
        />
        <Route 
          path="/tasks" 
          element={user ? <TaskManager /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
