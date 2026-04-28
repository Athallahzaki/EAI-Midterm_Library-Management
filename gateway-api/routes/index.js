const express = require('express');
const router = express.Router();
const { createServiceProxy } = require('../middleware/proxy');
const urlUtil = require("../utils/url");

// Load URLs from .env
const services = {
  book: urlUtil.serviceUrl("BOOK_SERVICE") || 'http://localhost:4001',
  user: urlUtil.serviceUrl("USER_SERVICE") || 'http://localhost:4002',
  auth: urlUtil.serviceUrl("AUTH_SERVICE") || 'http://localhost:4003',
  borrow: urlUtil.serviceUrl("BORROW_SERVICE") || 'http://localhost:4004',
};

module.exports = (app) => {
  // Register each service
  createServiceProxy(app, '/books', services.book);
  createServiceProxy(app, '/users', services.user);
  createServiceProxy(app, '/auth', services.auth);
  createServiceProxy(app, '/borrow', services.borrow);
  
  return [
    { url: '/docs/books-json', name: 'Book Service' },
    { url: '/docs/users-json', name: 'User Service' },
    { url: '/docs/auth-json', name: 'Auth Service' },
    { url: '/docs/borrow-json', name: 'Borrow Service' },
  ];
};