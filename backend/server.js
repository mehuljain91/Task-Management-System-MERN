// Import required dependencies
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create a new Express app
const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB configuration

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://username:passwordofusername@cluster0.9nj8wn9.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true }).then(() => {
    console.log("Connected to MongoDB successfully :)");
}).catch((e) => {
    console.log("Error while attempting to connect to MongoDB");
    console.log(e);
});

// User model
const User = mongoose.model('User', {
    username: String,
    email: String,
    password: String,
});

// Task model
const Task = mongoose.model('Task', {
    title: String,
    description: String,
    dueDate: Date,
    status: String,
    assignedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});


// User Registration
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ error: 'User already exists' });
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, 'secret_key');

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
});

// Authentication Middleware
const authenticateUser = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'secret_key');
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};

// Task Creation
app.post('/api/tasks', authenticateUser, async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;

        // Create a new task and associate it with the authenticated user
        const task = new Task({ title, description, dueDate, userId: req.userId });
        await task.save();

        res.status(201).json({ message: 'Task created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Task Update
app.put('/api/tasks/:taskId', authenticateUser, async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;

        // Find the task by ID and associated user ID
        const task = await Task.findOneAndUpdate(
            { _id: req.params.taskId, userId: req.userId },
            { title, description, dueDate },
            { new: true }
        );

        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Task Deletion
app.delete('/api/tasks/:taskId', authenticateUser, async (req, res) => {
    try {
        // Find the task by ID and associated user ID
        const task = await Task.findOneAndDelete({
            _id: req.params.taskId,
            userId: req.userId,
        });

        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
