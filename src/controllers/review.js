// src/controllers/review.js
const Review = require("../models/Review");


// src/controllers/review.js
exports.createReview = async (req, res, next) => {
  try {
    const { bookId, rating, reviewTxt } = req.body;

    const review = await Review.create({
      userId: req.user._id,  // جاي من auth middleware
      bookId,
      rating,
      reviewTxt,
    });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

exports.getBookReviews = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const reviews = await Review.find({ bookId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ msg: "Review not found" });

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await review.deleteOne();
    res.json({ msg: "Review deleted" });
  } catch (err) {
    next(err);
  }
};
