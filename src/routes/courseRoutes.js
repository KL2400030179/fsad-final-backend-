const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate, requireRole } = require('../middlewares/authMiddleware');

router.get('/', authenticate, courseController.getAllCourses);
router.post('/', authenticate, requireRole('ADMIN'), courseController.createCourse);
router.put('/:id', authenticate, requireRole('ADMIN'), courseController.updateCourse);
router.delete('/:id', authenticate, requireRole('ADMIN'), courseController.deleteCourse);

module.exports = router;
