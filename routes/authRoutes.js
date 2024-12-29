const express = require('express');
const { signup, login, updateUserRole, addPropertyListing } = require('../controllers/authController');
const { validateRole, validateServices, validatePropertyListing } = require('../middlewares/validateFields');

const router = express.Router();

router.post('/signup', validateRole, validateServices, signup);
router.post('/login', login);
router.post('/update-role', validateRole, updateUserRole);
router.post('/add-property-listing', validatePropertyListing, addPropertyListing);

module.exports = router; 