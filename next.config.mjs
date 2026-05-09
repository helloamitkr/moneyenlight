/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",            // static HTML for S3
  trailingSlash: true,         // /calculators → /calculators/index.html (S3 friendly)
  images: { unoptimized: true }, // no image optimizer on S3
};
export default nextConfig;
