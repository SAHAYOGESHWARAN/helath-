const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Import bcryptjs
const { v4: uuidv4 } = require('uuid'); // Import uuid
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.AUTH_SERVICE_PORT;
const JWT_SECRET = process.env.JWT_SECRET; // Secret for JWT signing

// TODO: Replace with a persistent database
const users = []; // In a real application, this would be a database

// Utility function to generate a JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
};

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // No token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user;
    next();
  });
};


// Login route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Compare provided password with hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user);
  const { password: _, ...userWithoutPassword } = user;
  res.status(200).json({ user: userWithoutPassword, token });
});

// Register route - refactored from server-genai.cjs
app.post('/api/auth/register', async (req, res) => {
  const { email, name, password, role, ...otherFields } = req.body;

  if (!email || !name || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'User with this email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10); // Hash password
  const newUser = {
    id: uuidv4(), // Generate unique ID
    name,
    email,
    password: hashedPassword,
    role,
    ...otherFields, // Include additional fields like dob, state, etc.
  };
  users.push(newUser);

  // Return user details without password
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

// Verify token route
app.post('/api/auth/verify', authenticateToken, async (req, res) => {
  // If authenticateToken middleware passes, req.user will contain the decoded token payload
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// Change password route
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  const { current, newPass } = req.body;
  const userId = req.user.id;

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Verify current password
  const isMatch = await bcrypt.compare(current, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Incorrect current password' });
  }

  // Hash and update new password
  user.password = await bcrypt.hash(newPass, 10);
  res.status(200).json({ message: 'Password changed successfully' });
});

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Auth Microservice running on port ${PORT}`);
});
