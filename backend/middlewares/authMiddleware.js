const blacklist = new Set(); // In-memory blacklist (use Redis for production)

// Middleware to check if a token is blacklisted
const isTokenBlacklisted = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (blacklist.has(token)) {
    return res
      .status(401)
      .json({ message: "Token is invalid. Please login again." });
  }

  next();
};

// Function to add token to blacklist (for logout)
const blacklistToken = (token) => {
  blacklist.add(token);
};

module.exports = { isTokenBlacklisted, blacklistToken };
