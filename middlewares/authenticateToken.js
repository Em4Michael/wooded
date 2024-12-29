const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains userId and role
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(403).json({ error: 'Token is invalid or expired' });
  }
};

module.exports = { authenticateToken };
