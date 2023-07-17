import React from 'react';

function TaskItem({ task, onDelete }) {
    return (
        <div>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Due Date: {task.dueDate}</p>
            <p>Assigned User: {task.assignedUser}</p>
            <button onClick={onDelete}>Delete Task</button>
        </div>
    );
}

export default TaskItem;
