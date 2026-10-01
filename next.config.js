/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*local*",
      },
    ],
  },
  optimizeFonts: false,
};

module.exports = nextConfig;
