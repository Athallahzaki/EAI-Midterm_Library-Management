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
      throw { status: 400, message: "Title and author required" };
    }

    const total = total_count ?? 1;
    const available = available_count ?? total;

    if (total < 0 || available < 0) {
      throw {
        status: 400,
        message: "Counts must be non-negative",
      };
    }

    if (available > total) {
      throw {
        status: 400,
        message: "available_count cannot exceed total_count",
      };
    }

    const book = await booksData.createBook({
      isbn: isbn ?? null,
      title,
      author,
      publisher: publisher ?? null,
      description: description ?? null,
      cover_url: cover_url ?? null,
      total_count: total,
      available_count: available,
    });

    res.status(201).json(book);
  } catch (err) {
    handleError(err, res);
  }
}

// GET /books
async function getAllBooks(req, res) {
  try {
    const books = await booksData.getAllBooks();
    res.json(books);
  } catch (err) {
    handleError(err, res);
  }
}

// GET /books/batch?ids=1,2,3
async function getBooksByIds(req, res) {
  try {
    const ids = req.query.ids?.split(",") || [];
    
    if (ids.length === 0) return res.json([]);

    const books = await booksData.getBooksByIds(ids);

    res.json(books);
  } catch (err) {
    handleError(err, res);
  }
}

// GET /books/:id
async function getBookById(req, res) {
  try {
    const book = await booksData.getBookById(req.params.id);

    if (!book) throw { status: 404, message: "Book not found" }

    res.json(book);
  } catch (err) {
    handleError(err, res);
  }
}

// PATCH /books/:id
async function updateBook(req, res) {
  try {
    const id = req.params.id;

    const existing = await booksData.getBookById(id);
    if (!existing) throw { status: 404, message: "Book not found" }

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
      throw {
        status: 400,
        message: "Counts must be non-negative",
      };
    }

    if (updated.available_count > updated.total_count) {
      throw {
        status: 400,
        message: "available_count cannot exceed total_count",
      };
    }

    const book = await booksData.updateBook(id, updated);

    res.json(book);
  } catch (err) {
    handleError(err, res);
  }
}

// DELETE /books/:id
async function deleteBook(req, res) {
  try {
    const id = req.params.id;

    const existing = await booksData.getBookById(id);
    if (!existing) throw { status: 404, message: "Book not found" }

    await booksData.deleteBook(id);

    res.sendStatus(204);
  } catch (err) {
    handleError(err, res);
  }
}

// POST /books/:id/borrow
async function borrowBook(req, res) {
  try {
    const id = req.params.id;

    const book = await booksData.getBookById(id);
    if (!book) throw { status: 404, message: "Book not found" }

    if (book.available_count <= 0) {
      throw {
        status: 400,
        message: "No available copies",
      };
    }

    const updated = await booksData.updateBook(id, {
      ...book,
      available_count: book.available_count - 1,
    });

    res.json(updated);
  } catch (err) {
    handleError(err, res);
  }
}

// POST /books/:id/return
async function returnBook(req, res) {
  try {
    const id = req.params.id;

    const book = await booksData.getBookById(id);
    if (!book) throw { status: 404, message: "Book not found" }

    if (book.available_count >= book.total_count) {
      throw {
        status: 400,
        message: "Already at max capacity",
      };
    }

    const updated = await booksData.updateBook(id, {
      ...book,
      available_count: book.available_count + 1,
    });

    res.json(updated);
  } catch (err) {
    handleError(err, res);
  }
}

function handleError(err, res) {
  const status = err.status || err.response?.status || 500;
  
  const message = err.response?.data?.message || err.message || "Internal Server Error";

  if (status === 500) console.error(err);
  return res.status(status).json({ message });
}

module.exports = {
  createBook,
  getAllBooks,
  getBooksByIds,
  getBookById,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook
};