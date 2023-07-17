import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskItem from './TaskItem';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('');
    const [assignedUser, setAssignedUser] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch tasks and users data from the backend
        Promise.all([axios.get('/api/tasks'), axios.get('/api/users')])
            .then(([tasksResponse, usersResponse]) => {
                setTasks(tasksResponse.data);
                setUsers(usersResponse.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleCreateTask = () => {
        axios
            .post('/api/tasks', {
                title,
                description,
                dueDate,
                status,
                assignedUser,
            })
            .then(() => {
                // Refresh the task list after creating a new task
                axios.get('/api/tasks').then((response) => {
                    setTasks(response.data);
                });
                // Clear the input fields
                setTitle('');
                setDescription('');
                setDueDate('');
                setStatus('');
                setAssignedUser('');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDeleteTask = (taskId) => {
        axios
            .delete(`/api/tasks/${taskId}`)
            .then(() => {
                // Refresh the task list after deleting a task
                axios.get('/api/tasks').then((response) => {
                    setTasks(response.data);
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div>
            <h1>Task List</h1>
            {/* Task creation form */}
            <div>
                <h3>Create Task</h3>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Due Date:</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>
                <div>
                    <label>Status:</label>
                    <input
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    />
                </div>
                <div>
                    <label>Assigned User:</label>
                    <select
                        value={assignedUser}
                        onChange={(e) => setAssignedUser(e.target.value)}
                    >
                        <option value="">Select User</option>
                        {users.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={handleCreateTask}>Create Task</button>
            </div>
            {/* Task list */}
            <div>
                {tasks.map((task) => (
                    <TaskItem
                        key={task._id}
                        task={task}
                        onDelete={() => handleDeleteTask(task._id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default TaskList;
