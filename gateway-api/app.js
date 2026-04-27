const express = require("express");
const swaggerUi = require("swagger-ui-express");
const setupProxies = require('./routes');

const app = express();

app.use(express.json());

const docEndpoints = setupProxies(app);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, {
  explorer: true,
  swaggerOptions: {
    urls: docEndpoints
  }
}));

module.exports = app;