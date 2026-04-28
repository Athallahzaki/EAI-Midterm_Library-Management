require("dotenv").config({ path: ["./.env.local", "../.env"] });

const app = require("./app");

const PORT = process.env.BORROW_SERVICE_PORT;

app.listen(PORT, () => {
  console.log(`Borrow Service running on port ${PORT}`);
});