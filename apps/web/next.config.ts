import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@workspace/ui"],
  experimental: {
    reactCompiler: true,
    // ppr: true,
    inlineCss: true,
  },
  logging: {
    fetches: {},
  },
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/**`,
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/events",
        destination: "/connect",
        permanent: true,
      },
      {
        source: "/events/:slug*",
        destination: "/connect/event/:slug*",
        permanent: true,
      },
      {
        source: "/online-giving",
        destination: "https://spiritoflifekearney.churchcenter.com/giving",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
