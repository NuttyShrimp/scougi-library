/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["oslo"]
  },
  webpack: (config) => {
    config.externals.push({
      canvas: 'canvas',
    });

    return config;
  },
  eslint: {
    dirs: ['src']
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
