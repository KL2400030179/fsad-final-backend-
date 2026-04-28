const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const db = new sqlite3.Database(path.join(__dirname, '../../database.sqlite'), (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run('PRAGMA foreign_keys = ON;');
    
    // Create Tables
    db.serialize(() => {
      // Users Table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT,
        full_name TEXT
      )`);

      // Add full_name column if it doesn't exist
      db.run(`PRAGMA table_info(users)`, (err, columns) => {
        // Try to add column regardless of errors
        db.run(`ALTER TABLE users ADD COLUMN full_name TEXT`, (err) => {
          // Ignore error if column already exists
        });
      });

      // Courses Table
      db.run(`CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE,
        title TEXT,
        description TEXT,
        credits INTEGER,
        capacity INTEGER,
        days TEXT,
        start_time TEXT,
        end_time TEXT
      )`);

      // Faculties Table
      db.run(`CREATE TABLE IF NOT EXISTS faculties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        course_id INTEGER NOT NULL,
        max_capacity INTEGER DEFAULT 80,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )`);

      // Registrations Table
      db.run(`CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        course_id INTEGER,
        faculty_id INTEGER,
        student_name TEXT,
        status TEXT,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE
      )`);

      // Seed Admin User
      const adminPass = bcrypt.hashSync('admin123', 10);
      db.run(`INSERT OR IGNORE INTO users (username, password, role, full_name) VALUES ('admin', ?, 'ADMIN', 'Administrator')`, [adminPass]);

      // Seed Student Users
      const studentPass = bcrypt.hashSync('student123', 10);
      db.run(`INSERT OR IGNORE INTO users (username, password, role, full_name) VALUES ('student', ?, 'STUDENT', 'John Doe')`, [studentPass]);
      db.run(`INSERT OR IGNORE INTO users (username, password, role, full_name) VALUES ('student2', ?, 'STUDENT', 'Jane Smith')`, [studentPass]);
      db.run(`INSERT OR IGNORE INTO users (username, password, role, full_name) VALUES ('student3', ?, 'STUDENT', 'Mike Johnson')`, [studentPass]);

      // Seed test courses
      db.run(`INSERT OR IGNORE INTO courses (code, title, description, credits, capacity, days, start_time, end_time) 
        VALUES ('CS101', 'Intro to Computer Science', 'Learn programming basics.', 3, 30, 'MWF', '10:00', '11:00')`);
      db.run(`INSERT OR IGNORE INTO courses (code, title, description, credits, capacity, days, start_time, end_time) 
        VALUES ('CS201', 'Data Structures', 'Advanced data structures and algorithms.', 4, 35, 'TTh', '09:30', '11:00')`);
      db.run(`INSERT OR IGNORE INTO courses (code, title, description, credits, capacity, days, start_time, end_time) 
        VALUES ('CS301', 'Web Development', 'Full-stack web development.', 3, 25, 'MWF', '14:00', '15:30')`);
      db.run(`INSERT OR IGNORE INTO courses (code, title, description, credits, capacity, days, start_time, end_time) 
        VALUES ('MATH201', 'Calculus II', 'Advanced integral calculus.', 4, 40, 'TTh', '11:30', '13:00')`);
      db.run(`INSERT OR IGNORE INTO courses (code, title, description, credits, capacity, days, start_time, end_time) 
        VALUES ('MATH301', 'Linear Algebra', 'Vector spaces and linear maps.', 3, 30, 'MWF', '11:00', '12:30')`);
      db.run(`INSERT OR IGNORE INTO courses (code, title, description, credits, capacity, days, start_time, end_time) 
        VALUES ('ENG101', 'English Composition', 'Essays and reading.', 3, 25, 'TTh', '14:00', '15:30')`);

      // Seed faculties for each course (with varying counts)
      // CS101 faculties
      db.run(`INSERT OR IGNORE INTO faculties (name, email, course_id, max_capacity) VALUES ('Dr. Smith', 'smith@university.edu', 1, 80)`);
      db.run(`INSERT OR IGNORE INTO faculties (name, email, course_id, max_capacity) VALUES ('Prof. Williams', 'williams@university.edu', 1, 80)`);
      
      // CS201 faculties
      db.run(`INSERT OR IGNORE INTO faculties (name, email, course_id, max_capacity) VALUES ('Dr. Brown', 'brown@university.edu', 2, 80)`);
      
      // CS301 faculties
      db.run(`INSERT OR IGNORE INTO faculties (name, email, course_id, max_capacity) VALUES ('Prof. Anderson', 'anderson@university.edu', 3, 80)`);
      db.run(`INSERT OR IGNORE INTO faculties (name, email, course_id, max_capacity) VALUES ('Dr. Lee', 'lee@university.edu', 3, 80)`);
      
      // MATH201 faculties
      db.run(`INSERT OR IGNORE INTO faculties (name, email, course_id, max_capacity) VALUES ('Prof. Johnson', 'johnson@university.edu', 4, 80)`);
      
      // MATH301 faculties
      db.run(`INSERT OR IGNORE INTO faculties (name, email, course_id, max_capacity) VALUES ('Dr. Davis', 'davis@university.edu', 5, 80)`);
      db.run(`INSERT OR IGNORE INTO faculties (name, email, course_id, max_capacity) VALUES ('Prof. Miller', 'miller@university.edu', 5, 80)`);
      
      // ENG101 faculties
      db.run(`INSERT OR IGNORE INTO faculties (name, email, course_id, max_capacity) VALUES ('Dr. Taylor', 'taylor@university.edu', 6, 80)`);
    });
  }
});

module.exports = db;
