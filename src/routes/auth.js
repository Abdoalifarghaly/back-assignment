const express = require("express");
const router = express.Router();

// استدعاء الكنترولر
const { signup, login } = require("../controllers/auth");
const auth = require("../middleware/auth");
// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);



router.put("/change-password", auth, async (req, res) => {
  const { newPassword } = req.body;
  req.user.password = newPassword;
  await req.user.save(); // هيشغل pre('save') ويشفر الباسورد
  res.json({ msg: "Password updated successfully" });
});

module.exports = router;
