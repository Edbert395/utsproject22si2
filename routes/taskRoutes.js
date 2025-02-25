const express = require('express'); 
const taskController = require('../controllers/taskController'); 
const { authMiddleware, validateTask } = require('../middleware/authMiddleware');

const router = express.Router(); 

router.use(authMiddleware); 

router.post('/tasks', validateTask, taskController.createTask); 
router.get('/tasks', taskController.getTasks); 
router.put('/tasks/:id', taskController.updateTask); 
router.delete('/tasks/:id', taskController.deleteTask); 

module.exports = router; 