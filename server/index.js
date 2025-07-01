const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const saltRounds = 10;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'agrovia-sheharagamage2002-1cc3.c.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_iOtAXIKDXzwb0S4k4dm',
  database: 'defaultdb',
  port: 12267,
  ssl: {
    ca: fs.readFileSync(__dirname + '/ca.pem'),
    rejectUnauthorized: true
  }
});

db.connect(error => {
  if (error) {
    console.error('Database connection failed:', error.stack);
    return;
  }
  console.log('Connected to database.');
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const [result] = await db.promise().query('SELECT * FROM user_data WHERE email = ?', [normalizedEmail]);

    if (result.length === 0) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    res.send({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        isApproved: user.isApproved,
        organizationId: user.organization_id
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send({ message: 'Server error' });
  }
});

// Signup route
app.post('/signup', async (req, res) => {
  const { firstName, lastName, NIC, address, location, email, password, organizationId } = req.body;

  if (!firstName || !lastName || !NIC || !address || !location || !email || !password || !organizationId) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const [existingUser] = await db.promise().query('SELECT email FROM user_data WHERE email = ?', [normalizedEmail]);
    if (existingUser.length > 0) {
      return res.status(409).send({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = `
      INSERT INTO user_data (first_name, last_name, nic, address, district, email, password, isApproved, organization_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [firstName, lastName, NIC, address, location, normalizedEmail, hashedPassword, false, organizationId];

    await db.promise().query(sql, values);

    res.status(201).send({ message: 'Signup successful' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).send({ message: 'Email already exists' });
    }
    console.error('Signup error:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

// Start server
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
