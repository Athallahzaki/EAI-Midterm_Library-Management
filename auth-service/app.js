const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger")
const routes = require("./routes")

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(routes);

module.exports = app;