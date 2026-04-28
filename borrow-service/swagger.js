const swaggerJsdoc = require("swagger-jsdoc");

module.exports = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Borrow Service",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        // For standard users
        userAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter User JWT. (Role-based access)",
        },
        // For internal microservices
        serviceAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter Internal Service Token. (M2M access only)",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
});