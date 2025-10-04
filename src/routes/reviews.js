// src/routes/reviews.js
const express = require("express");
const { createReview, getBookReviews, deleteReview } = require("../controllers/review");
const auth = require("../middleware/auth"); // ميدل وير للتحقق من التوكن

const router = express.Router();

// إضافة ريفيو
router.post("/", auth, createReview);

// كل الريفيوز الخاصة بكتاب
router.get("/:bookId", getBookReviews);

// حذف ريفيو
router.delete("/:id", auth, deleteReview);

module.exports = router;
