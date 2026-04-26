const booksData = require("../data/books.data");

// POST /books
async function createBook(req, res) {
  try {
    const {
      isbn,
      title,
      author,
      publisher,
      description,
      cover_url,
      total_count,
      available_count,
    } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: "Title and author required" });
    }

    const total = total_count ?? 1;
    const available = available_count ?? total;

    if (total < 0 || available < 0) {
      return res.status(400).json({
        message: "Counts must be non-negative",
      });
    }

    if (available > total) {
      return res.status(400).json({
        message: "available_count cannot exceed total_count",
      });
    }

    const book = await booksData.createBook({
      isbn,
      title,
      author,
      publisher,
      description: description ?? "",
      cover_url: cover_url ?? "",
      total_count: total,
      available_count: available,
    });

    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

// GET /books
async function getAllBooks(req, res) {
  try {
    const books = await booksData.getAllBooks();
    res.json(books);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

// GET /books/:id
async function getBookById(req, res) {
  try {
    const book = await booksData.getBookById(req.params.id);

    if (!book) return res.sendStatus(404);

    res.json(book);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

// PATCH /books/:id
async function updateBook(req, res) {
  try {
    const id = req.params.id;

    const existing = await booksData.getBookById(id);
    if (!existing) return res.sendStatus(404);

    const updated = {
      isbn: req.body.isbn ?? existing.isbn,
      title: req.body.title ?? existing.title,
      author: req.body.author ?? existing.author,
      publisher: req.body.publisher ?? existing.publisher,
      description: req.body.description ?? existing.description,
      cover_url: req.body.cover_url ?? existing.cover_url,
      total_count: req.body.total_count ?? existing.total_count,
      available_count:
        req.body.available_count ?? existing.available_count,
    };

    if (updated.total_count < 0 || updated.available_count < 0) {
      return res.status(400).json({
        message: "Counts must be non-negative",
      });
    }

    if (updated.available_count > updated.total_count) {
      return res.status(400).json({
        message: "available_count cannot exceed total_count",
      });
    }

    const book = await booksData.updateBook(id, updated);

    res.json(book);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

// DELETE /books/:id
async function deleteBook(req, res) {
  try {
    const id = req.params.id;

    const existing = await booksData.getBookById(id);
    if (!existing) return res.sendStatus(404);

    await booksData.deleteBook(id);

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

// POST /books/:id/borrow
async function borrowBook(req, res) {
  try {
    const id = req.params.id;

    const book = await booksData.getBookById(id);
    if (!book) return res.sendStatus(404);

    if (book.available_count <= 0) {
      return res.status(400).json({
        message: "No available copies",
      });
    }

    const updated = await booksData.updateBook(id, {
      ...book,
      available_count: book.available_count - 1,
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

// POST /books/:id/return
async function returnBook(req, res) {
  try {
    const id = req.params.id;

    const book = await booksData.getBookById(id);
    if (!book) return res.sendStatus(404);

    if (book.available_count >= book.total_count) {
      return res.status(400).json({
        message: "Already at max capacity",
      });
    }

    const updated = await booksData.updateBook(id, {
      ...book,
      available_count: book.available_count + 1,
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook
};