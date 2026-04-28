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

    if (!book_id) {
      return res.status(400).json({ message: "book_id required" });
    }

    // 1. Call Book Service to decrease availability
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

    // 2. Record borrow
    const record = await borrowData.createBorrow({
      user_id,
      book_id,
    });
    const [enriched] = await joinBorrows([record]);

    res.status(201).json(enriched);

  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    
    console.error(err.response?.data || err.message);
    res.sendStatus(500);
  }
}

// POST /borrow/:id/return
async function returnBook(req, res) {
  try {
    const id = req.params.id;

    const existing = await borrowData.getBorrowById(id);
    if (!existing) return res.sendStatus(404);

    if (req.user.type === "user" && existing.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (existing.status === "returned") {
      return res.status(400).json({ message: "Already returned" });
    }

    // 1. Increase availability in Book Service
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

    // 2. Update record
    const updated = await borrowData.returnBorrow(id);
    const [enriched] = await joinBorrows([updated]);

    res.json(enriched);

  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }

    console.error(err.response?.data || err.message);
    res.sendStatus(500);
  }
}

// GET /borrow (admin)
async function getAllBorrows(req, res) {
  try {
    const data = await borrowData.getAllBorrows();
    const enriched = await joinBorrows(data);
    res.json(enriched);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }

    console.error(err);
    res.sendStatus(500);
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
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }

    console.error(err);
    res.sendStatus(500);
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
      axios.get(`${USER_SERVICE_URL}/users?ids=${userIds.join(",")}`, {
        headers: {
          Authorization: `Bearer ${jwtUtil.generateServiceToken()}`
        },
        timeout: 3000
      }),
      axios.get(`${BOOK_SERVICE_URL}/books?ids=${bookIds.join(",")}`, {
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

module.exports = {
  borrowBook,
  returnBook,
  getAllBorrows,
  getMyBorrows,
};