require("dotenv").config({ path: ["./.env.local", "../.env"] });

const app = require("./app");

const PORT = process.env.BOOK_SERVICE_PORT;

app.listen(PORT, () => {
  console.log(`Book Service running on port ${PORT}`);
});