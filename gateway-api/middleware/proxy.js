const { createProxyMiddleware } = require('http-proxy-middleware');

// Helper to create both API and Doc proxies
const createServiceProxy = (app, path, target) => {
  // API proxy
  app.use(path, createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (pathReq) => `${path}${pathReq}`,
    onError: (err, req, res) => {
      res.status(503).json({ message: 'Service temporarily unavailable' });
    }
  }));

  // Docs proxy
  const docPath = `/docs${path}-json`;

  app.use(docPath, createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: () => "/api-docs-json"
  }));
};

module.exports = { createServiceProxy };