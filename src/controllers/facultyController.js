const db = require('../config/database');

exports.getFacultiesByCourse = (req, res) => {
  const { courseId } = req.params;
  
  db.all(`SELECT f.*, COUNT(r.id) as enrolled_count 
          FROM faculties f 
          LEFT JOIN registrations r ON r.faculty_id = f.id AND r.status = 'REGISTERED'
          WHERE f.course_id = ?
          GROUP BY f.id`, [courseId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Add available slots info
    const faculties = rows.map(f => ({
      ...f,
      available_slots: f.max_capacity - (f.enrolled_count || 0)
    }));
    
    res.json(faculties);
  });
};

exports.getFacultyStudents = (req, res) => {
  const { facultyId } = req.params;
  
  db.get(`SELECT * FROM faculties WHERE id = ?`, [facultyId], (err, faculty) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    
    db.all(`SELECT r.id, r.student_id, r.student_name, r.status, u.username
            FROM registrations r
            LEFT JOIN users u ON u.id = r.student_id
            WHERE r.faculty_id = ? AND r.status = 'REGISTERED'
            ORDER BY r.student_name ASC`, [facultyId], (err, students) => {
      if (err) return res.status(500).json({ error: err.message });
      
      res.json({
        faculty: faculty,
        total_enrolled: students.length,
        available_slots: faculty.max_capacity - students.length,
        students: students
      });
    });
  });
};

exports.getAllFaculties = (req, res) => {
  db.all(`SELECT f.*, c.code, c.title, COUNT(r.id) as enrolled_count
          FROM faculties f
          JOIN courses c ON f.course_id = c.id
          LEFT JOIN registrations r ON r.faculty_id = f.id AND r.status = 'REGISTERED'
          GROUP BY f.id
          ORDER BY c.title, f.name`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const faculties = rows.map(f => ({
      ...f,
      available_slots: f.max_capacity - (f.enrolled_count || 0)
    }));
    
    res.json(faculties);
  });
};

exports.addFaculty = (req, res) => {
  const { name, email, course_id, max_capacity } = req.body;
  
  if (!name || !course_id) {
    return res.status(400).json({ error: 'Name and course_id are required' });
  }
  
  const capacity = max_capacity || 80;
  
  db.run(`INSERT INTO faculties (name, email, course_id, max_capacity) VALUES (?, ?, ?, ?)`,
    [name, email, course_id, capacity],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Faculty added successfully' });
    }
  );
};
