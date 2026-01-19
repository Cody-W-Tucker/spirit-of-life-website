import { createClient } from "next-sanity";
import { defineLive } from "next-sanity/live";
import type { ReactNode } from "react";

import { apiVersion, dataset, projectId, studioUrl } from "./api";
import { token } from "./token";

/**
 * Use defineLive to enable automatic revalidation and refreshing of your fetched content
 * Learn more: https://github.com/sanity-io/next-sanity
 */

// Create a client with live preview capabilities
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Use the live API for real-time updates
  stega: {
    enabled: true,
    studioUrl,
  },
});

export const {
  sanityFetch,
  SanityLive,
}: { sanityFetch: any; SanityLive: any } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
});
