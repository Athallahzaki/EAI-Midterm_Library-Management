const express = require('express');
const router = express.Router();
const { createServiceProxy } = require('../middleware/proxy');
const urlUtil = require("../utils/url");

// Load URLs from .env
const services = {
  auth: urlUtil.serviceUrl("AUTH_SERVICE") || 'http://localhost:4003',
  user: urlUtil.serviceUrl("USER_SERVICE") || 'http://localhost:4002',
  book: urlUtil.serviceUrl("BOOK_SERVICE") || 'http://localhost:4001',
};

module.exports = (app) => {
  // Register each service
  createServiceProxy(app, '/auth', services.auth);
  createServiceProxy(app, '/users', services.user);
  createServiceProxy(app, '/books', services.book);
  
  return [
    { url: '/docs/auth-json', name: 'Auth Service' },
    { url: '/docs/users-json', name: 'User Service' },
    { url: '/docs/books-json', name: 'Book Service' }
  ];
};