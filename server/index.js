const express = require('express');
const mysql = require('mysql2'); // <--- CHANGE THIS LINE
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
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

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query(
        'SELECT * FROM user_data WHERE email = ? AND password = ?',
        [email, password],
        (err, result) => {
            if (err) {
                console.error('Login DB query error:', err); // Added specific logging
                return res.status(500).send({ error: 'Database error' });
            }
            if (result.length > 0) {
                res.send({ message: 'Login successful' });
            } else {
                res.status(401).send({ message: 'Invalid credentials' });
            }
        }
    );
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});