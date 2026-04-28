const jwt = require('jsonwebtoken');

const SECRET_KEY = 'super-secret-course-key-123';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  
  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Failed to authenticate token.' });
    req.user = decoded;
    next();
  });
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ error: 'Requires ' + role + ' role' });
    }
  };
};

module.exports = {
  authenticate,
  requireRole,
  SECRET_KEY
};
