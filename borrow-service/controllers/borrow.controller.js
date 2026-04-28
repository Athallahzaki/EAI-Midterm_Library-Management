const borrowData = require("../data/borrow.data");
const axios = require("axios");
const jwtUtil = require("../utils/jwt");
const urlUtil = require("../utils/url");

const USER_SERVICE_URL = urlUtil.serviceUrl("USER_SERVICE");
const BOOK_SERVICE_URL = urlUtil.serviceUrl("BOOK_SERVICE");

// POST /borrow
async function borrowBook(req, res) {
  try {
    const { book_id } = req.body || {};
    const user_id = req.user.id;

    if (!book_id) throw {status: 400, message: "book_id required" };

    await axios.post(
      `${BOOK_SERVICE_URL}/books/${book_id}/borrow`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwtUtil.generateServiceToken()}`,
        },
        timeout: 3000
      }
    );

    const record = await borrowData.createBorrow({
      user_id,
      book_id,
    });
    const [enriched] = await joinBorrows([record]);

    res.status(201).json(enriched);

  } catch (err) {
    handleError(err, res);
  }
}

// POST /borrow/:id/return
async function returnBook(req, res) {
  try {
    const id = req.params.id;

    const existing = await borrowData.getBorrowById(id);
    if (!existing) throw {status: 404, message: "Book Borrow not found" };

    if (req.user.type === "user" && existing.user_id !== req.user.id) {
      throw {status: 403, message: "Forbidden" };
    }

    if (existing.status === "returned") {
      throw {status: 400, message: "Already returned" };
    }

    await axios.post(
      `${BOOK_SERVICE_URL}/books/${existing.book_id}/return`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwtUtil.generateServiceToken()}`,
        },
        timeout: 3000
      }
    );

    const updated = await borrowData.returnBorrow(id);
    const [enriched] = await joinBorrows([updated]);

    res.json(enriched);

  } catch (err) {
    handleError(err, res);
  }
}

// GET /borrow (admin)
async function getAllBorrows(req, res) {
  try {
    const data = await borrowData.getAllBorrows();
    const enriched = await joinBorrows(data);
    res.json(enriched);
  } catch (err) {
    handleError(err, res);
  }
}

// GET /borrow/me
async function getMyBorrows(req, res) {
  try {
    const user_id = req.user.id;
    const data = await borrowData.getBorrowsByUser(user_id);
    const enriched = await joinBorrows(data);
    res.json(enriched);
  } catch (err) {
    handleError(err, res);
  }
}

async function joinBorrows(input) {
  if (!input) return [];

  const borrows = Array.isArray(input) ? input : [input];
  if (borrows.length === 0) return [];

  const userIds = [...new Set(borrows.map(b => b.user_id))];
  const bookIds = [...new Set(borrows.map(b => b.book_id))];

  try {
    const [usersRes, booksRes] = await Promise.all([
      axios.get(`${USER_SERVICE_URL}/users/batch?ids=${userIds.join(",")}`, {
        headers: {
          Authorization: `Bearer ${jwtUtil.generateServiceToken()}`
        },
        timeout: 3000
      }),
      axios.get(`${BOOK_SERVICE_URL}/books/batch?ids=${bookIds.join(",")}`, {
        headers: {
          Authorization: `Bearer ${jwtUtil.generateServiceToken()}`
        },
        timeout: 3000
      })
    ]);

    const users = usersRes.data;
    const books = booksRes.data;

    const userMap = Object.fromEntries(users.map(u => [u.id, u]));
    const bookMap = Object.fromEntries(books.map(b => [b.id, b]));

    return borrows.map(b => ({
      ...b,
      user: userMap[b.user_id] || null,
      book: bookMap[b.book_id] || null,
    }));

  } catch (err) {
    console.error("Join error:", err.message);

    return borrows;
  }
}

function handleError(err, res) {
  const status = err.status || err.response?.status || 500;
  
  const message = err.response?.data?.message || err.message || "Internal Server Error";

  if (status === 500) console.error(err);
  return res.status(status).json({ message });
}

module.exports = {
  borrowBook,
  returnBook,
  getAllBorrows,
  getMyBorrows,
};