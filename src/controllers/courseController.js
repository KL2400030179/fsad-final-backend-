const db = require('../config/database');

exports.getAllCourses = (req, res) => {
  db.all(`SELECT * FROM courses`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.createCourse = (req, res) => {
  const { code, title, description, credits, instructor, capacity, days, start_time, end_time } = req.body;
  if (!code || !title || !credits || !days) return res.status(400).json({ error: 'Missing required fields' });
  
  db.run(`INSERT INTO courses (code, title, description, credits, instructor, capacity, days, start_time, end_time) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
    [code, title, description, credits, instructor, capacity, days, start_time, end_time], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Course created' });
    }
  );
};

exports.updateCourse = (req, res) => {
  const { id } = req.params;
  const { code, title, description, credits, instructor, capacity, days, start_time, end_time } = req.body;
  
  db.run(`UPDATE courses SET 
            code = ?, title = ?, description = ?, credits = ?, 
            instructor = ?, capacity = ?, days = ?, start_time = ?, end_time = ? 
          WHERE id = ?`, 
    [code, title, description, credits, instructor, capacity, days, start_time, end_time, id], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Course not found' });
      res.json({ message: 'Course updated successfully' });
    }
  );
};

exports.deleteCourse = (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM courses WHERE id = ?`, [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted' });
  });
};
