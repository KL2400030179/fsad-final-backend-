const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { SECRET_KEY } = require('../middlewares/authMiddleware');

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
      res.json({ token, role: user.role, username: user.username });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
};

exports.register = (req, res) => {
  const { username, password, role, full_name } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  const userRole = role === 'ADMIN' ? 'ADMIN' : 'STUDENT';
  const hashedPass = bcrypt.hashSync(password, 10);
  const studentFullName = full_name || username;
  
  db.run(`INSERT INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)`, [username, hashedPass, userRole, studentFullName], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'Username already exists' });
      return res.status(500).json({ error: err.message });
    }
    const token = jwt.sign({ id: this.lastID, username, role: userRole }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token, role: userRole, username, full_name: studentFullName });
  });
};
