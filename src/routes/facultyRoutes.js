const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const { authenticate, requireRole } = require('../middlewares/authMiddleware');

router.get('/', authenticate, facultyController.getAllFaculties);
router.get('/course/:courseId', authenticate, facultyController.getFacultiesByCourse);
router.get('/:facultyId/students', authenticate, facultyController.getFacultyStudents);
router.post('/', authenticate, requireRole('ADMIN'), facultyController.addFaculty);

module.exports = router;
