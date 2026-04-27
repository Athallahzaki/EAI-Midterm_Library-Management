const express = require("express");
const ensureBody = require("./middleware/ensureBody");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger")
const routes = require("./routes")

const app = express();

app.use(express.json());
app.use(ensureBody);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs-json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use(routes);

module.exports = app;