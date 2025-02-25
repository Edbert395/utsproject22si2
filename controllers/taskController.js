const Task = require('../models/taskModel');
const taskController = {
    createTask: async (req, res) => {
        const { title, category, deadline, status } = req.body;
        const userId = req.user.id;
        try {
            const taskId = await Task.create(userId, title, category, deadline, status);
            res.status(201).json({ taskId });
        } catch (err) {
            res.status(500).json({ message: 'Task creation failed' });
        }
    },
    getTasks: async (req, res) => {
        const userId = req.user.id;
        try {
            const tasks = await Task.findAllByUserId(userId);
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch tasks' });
        }
    },
    updateTask: async (req, res) => {
        const { id } = req.params;
        const { title, category, deadline, status } = req.body;
        try {
            await Task.update(id, title, category, deadline, status);
            res.json({ message: 'Task updated' });
        } catch (err) {
            res.status(500).json({ message: 'Task update failed' });
        }
    },
    deleteTask: async (req, res) => {
        const { id } = req.params;
        try {
            await Task.delete(id);
            res.json({ message: 'Task deleted' });
        } catch (err) {
            res.status(500).json({ message: 'Task deletion failed' });
        }
    }
};
module.exports = taskController;