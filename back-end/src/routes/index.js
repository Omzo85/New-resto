const express = require('express');
const router = express.Router();
const menuController = require('../controllers/index');

// Define routes for menu items
router.get('/menu', menuController.getMenuItems);
router.post('/menu', menuController.createMenuItem);
router.put('/menu/:id', menuController.updateMenuItem);
router.delete('/menu/:id', menuController.deleteMenuItem);

// Additional routes can be added here

module.exports = router;