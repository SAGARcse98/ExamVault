/** @type {import('next').NextConfig} */
const nextConfig = {
  // Increase the body size limit for file uploads (default is 4.5MB on Vercel)
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
