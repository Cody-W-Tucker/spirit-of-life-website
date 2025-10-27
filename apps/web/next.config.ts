import type { NextConfig } from "next";
import { client } from "@/lib/sanity/client";
import { queryRedirects } from "@/lib/sanity/query";

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
    minimumCacheTTL: 31_536_000,
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
    interface SanityRedirect {
      source: string;
      destination: string;
      permanent?: boolean;
      // allow any additional fields coming from the CMS
      [key: string]: unknown;
    }

    interface AppRedirect {
      source: string;
      destination: string;
      permanent: boolean;
    }

    const mappedRedirects: AppRedirect[] = (redirects as SanityRedirect[]).map(
      (redirect): AppRedirect => ({
        ...redirect,
        permanent: redirect.permanent ?? false,
      })
    );
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
    return [...mappedRedirects, ...staticRedirects];
  },
};

export default nextConfig;
