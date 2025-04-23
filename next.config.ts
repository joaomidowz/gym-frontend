const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,
  // outras configs que você já tiver
};

module.exports = withPWA(nextConfig);
