const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const booksCtrl = require('../controllers/books');

// GET all books (with pagination + avg rating)
router.get('/', booksCtrl.listBooks);

// GET single book by ID (with reviews)
router.get('/:id', booksCtrl.getBook);

// CREATE new book (requires login)
router.post('/', auth, booksCtrl.createBook);

// UPDATE book (requires ownership)
router.put('/:id', auth, booksCtrl.updateBook);

// DELETE book (requires ownership)
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;
