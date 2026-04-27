require("dotenv").config({ path: ["./.env.local", "../.env"] });

const app = require("./app");

const PORT = process.env.AUTH_SERVICE_PORT;

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});