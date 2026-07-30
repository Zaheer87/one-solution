/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: [
      "images.unsplash.com",
      "firebasestorage.googleapis.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  allowedDevOrigins: [
    "10.145.189.13",
    "localhost",
    "127.0.0.1",
  ],
};

module.exports = nextConfig;