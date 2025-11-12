const axios = require('axios');
const AUTH_API_URL = process.env.AUTH_API_URL || 'http://localhost:4005';

const verifyToken = async (token) => {
  try {
    const { data } = await axios.post(`${AUTH_API_URL}/auth/verify`, { token });
    return data.user;
  } catch {
    return null;
  }
};

const checkAuth = (roles) => async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header with Bearer token is required' });
  }

  const token = authHeader.split(' ')[1];
  const user = await verifyToken(token);

  if (!user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (roles && !roles.includes(user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  req.user = user;
  next();
};

module.exports = { checkAuth };
