import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import AdminDashboard from './components/AdminDashboard';

function App() {

  const tasks = [
    {
      id: 1,
      title: 'Task 1',
      description: 'This is task 1',
      status: 'in-progress',
      dueDate: '2023-07-14',
      assignedUser: 'User A',
    },
    // Add more sample tasks as needed
  ];

  return (
    <Router>
      <div>
        <AdminDashboard tasks={tasks} />
      </div>
      <Routes>
        <Route exact path="/" element={ <LoginForm/> } />
        <Route path="/register" element={ <RegistrationForm/> } />
        <Route path="/tasks" element={ <TaskList/> } />
        <Route path="/task/:id" element={ <TaskForm/> } />
      </Routes>
    </Router>
  );
}

export default App;
