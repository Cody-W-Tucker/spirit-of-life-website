import { client } from "@/lib/sanity/client";
import { queryRedirects } from "@/lib/sanity/query";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  experimental: {
    reactCompiler: true,
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
    const redirects = await client.fetch(queryRedirects);
    const staticRedirects = [
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
    ];
    return [...staticRedirects, ...redirects];
  },
};

export default nextConfig;
