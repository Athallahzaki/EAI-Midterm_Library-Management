require("dotenv").config({ path: ["./.env.local", "../.env"] });

const app = require("./app");

const PORT = process.env.GATEWAY_PORT;

app.listen(PORT, () => {
  console.log(`Gateway API running on port ${PORT}`);
}); 