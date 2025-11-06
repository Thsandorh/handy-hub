/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@mesterpont/types'],
  images: {
    domains: ['mesterpont-uploads.s3.eu-central-1.amazonaws.com'],
  },
}

module.exports = nextConfig
