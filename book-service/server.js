const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

const app = require("./app");

const PORT = process.env.BOOK_SERVICE_PORT;

app.listen(PORT, () => {
  console.log(`Book Service running on port ${PORT}`);
});