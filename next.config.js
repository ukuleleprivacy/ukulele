const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

/** @param {string} phase @returns {import('next').NextConfig} */
module.exports = (phase) => ({
  // Keep production builds from overwriting the running development server.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
  output: 'export',
  reactStrictMode: true,
});
