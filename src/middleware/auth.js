const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
  const headers = req.headers.authorization;

  if (!headers || !headers.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Invalid token" });
  }

  const token = headers.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = await User.findById(payload.id).select("-password");
    if (!req.user) return res.status(401).json({ msg: "User not found" });

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token invalid" });
  }
};
