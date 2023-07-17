import React, { useState } from 'react';

function TaskForm({ onSubmit, initialData }) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [dueDate, setDueDate] = useState(initialData?.dueDate || '');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create task object
        const task = {
            title,
            description,
            dueDate,
        };

        onSubmit(task);

        // Reset form fields
        setTitle('');
        setDescription('');
        setDueDate('');
    };

    return (
        <div>
            <h2>{initialData ? 'Update Task' : 'Create Task'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="dueDate">Due Date:</label>
                    <input
                        type="date"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">{initialData ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
}

export default TaskForm;
