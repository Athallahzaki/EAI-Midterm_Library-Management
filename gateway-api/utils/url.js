function buildBaseUrl(base, port) {
  const url = new URL(base);
  url.port = port;

  // remove trailing slash for consistency
  return url.toString().replace(/\/$/, "");
}

function serviceUrl(serviceName) {
  const base = process.env[`${serviceName}_BASE_URL`];
  const port = process.env[`${serviceName}_PORT`];

  if (!base || !port) {
    throw new Error(`Missing env for ${serviceName}`);
  }

  return buildBaseUrl(base, port);
}

module.exports = {
  buildBaseUrl,
  serviceUrl,
};