const Book = require("../models/Book");
const Review = require("../models/Review");

// ================== CREATE ==================
exports.createBook = async (req, res, next) => {
  try {
    const { title, author, description, genre, year } = req.body;

    if (!title || !author) {
      return res.status(400).json({ msg: "Title and Author are required" });
    }

    const book = await Book.create({
      title,
      author,
      description,
      genre,
      year,
      addBy: req.user._id,
    });

    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

// ================== READ (list) ==================
exports.listBooks = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 5);
    const skip = (page - 1) * limit;

    const docs = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const ids = docs.map(d => d._id);

    const ratings = await Review.aggregate([
      { $match: { bookId: { $in: ids } } },
      { $group: { _id: "$bookId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);

    const map = {};
    ratings.forEach(r => map[r._id.toString()] = r);

    const result = docs.map(b => ({
      ...b,
      avgRating: map[b._id.toString()]?.avgRating || 0,
      reviewsCount: map[b._id.toString()]?.count || 0
    }));

    const total = await Book.countDocuments();

    res.json({
      data: result,
      page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    next(err);
  }
};

// ================== READ (single book) ==================
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) return res.status(404).json({ msg: "Book not found" });

    const reviews = await Review.find({ bookId: book._id }).populate("userId", "name email");

    res.json({ ...book, reviews });
  } catch (err) {
    next(err);
  }
};

// ================== UPDATE ==================
exports.updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: "Book not found" });

    if (book.addBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const { title, author, description, genre, year } = req.body;

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.genre = genre || book.genre;
    book.year = year || book.year;

    await book.save();

    res.json(book);
  } catch (err) {
    next(err);
  }
};

// ================== DELETE ==================
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: "Book not found" });

    if (book.addBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await book.deleteOne();
    res.json({ msg: "Book deleted successfully" });
  } catch (err) {
    next(err);
  }
};
