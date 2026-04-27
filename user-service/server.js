require("dotenv").config({ path: ["./.env.local", "../.env"] });

const app = require("./app");

const PORT = process.env.USER_SERVICE_PORT;

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});