const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const users = [
  {
    id: 'pat1',
    email: 'john.doe@email.com',
    password: 'Password123!',
    role: 'patient',
  },
  {
    id: 'pro1',
    email: 'jane.smith@email.com',
    password: 'Password123!',
    role: 'provider',
  },
  {
    id: 'adm1',
    email: 'admin@novopath.com',
    password: 'password123',
    role: 'admin',
  },
];

// Hash passwords
users.forEach(user => {
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(user.password, salt);
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/auth/verify', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.json({ user: decoded });
  });
});

const PORT = process.env.AUTH_PORT || 4005;
const server = app.listen(PORT, () => console.log(`Auth microservice listening on port ${PORT}`));

module.exports = { app, server };
