const express = require('express');

const { 
  createProperty, 
  getAllProperties, 
  getPropertyById, 
  updateProperty, 
  deleteProperty 
} = require('../controllers/propertyController');
const { authenticateToken } = require('../middlewares/authenticateToken');
const { validatePropertyCreation } = require('../middlewares/validateProperty');

const router = express.Router();

// Property routes
router.post('/create', authenticateToken, validatePropertyCreation, createProperty);
router.get('/all', getAllProperties); // Get all properties
router.get('/:propertyId', getPropertyById); // Get a property by ID
router.put('/update', authenticateToken, updateProperty); // Update a property
router.delete('/delete/:propertyId', authenticateToken, deleteProperty); // Delete a property

module.exports = router;
 