const express = require('express');
const app = express();
const cors = require('cors');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const registrationRoutes = require('./src/routes/registrationRoutes');
const facultyRoutes = require('./src/routes/facultyRoutes');

// Global Middlewares
app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/faculties', facultyRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));
