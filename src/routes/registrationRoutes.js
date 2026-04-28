const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { authenticate, requireRole } = require('../middlewares/authMiddleware');

router.get('/', authenticate, registrationController.getRegistrations);
router.post('/', authenticate, registrationController.registerCourse);
router.delete('/:id', authenticate, registrationController.dropRegistration);

module.exports = router;
