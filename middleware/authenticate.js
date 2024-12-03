const jwt = require('jsonwebtoken');
require("dotenv").config();

const authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Authorization header missing or invalid.' });
  }

  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`[AUTH LOG] Token decoded: User ID = ${decoded.id}, Email = ${decoded.email}`);
    req.user = decoded;
    next();

  } catch (error) {
    // Menangani beberapa jenis error yang umum
    if (error.name === 'TokenExpiredError') {
      console.error('[AUTH ERROR] Token expired:', error.message);
      return res.status(401).json({ error: 'Unauthorized: Token has expired.' });
    } else if (error.name === 'JsonWebTokenError') {
      console.error('[AUTH ERROR] Invalid token:', error.message);
      return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }

    // Menangani error lain dan memberikan response generik
    console.error('[AUTH ERROR] Unknown error during token verification:', error.message);
    res.status(500).json({ error: 'Internal Server Error: Token verification failed.' });
  }
};

module.exports = authenticate;
