import { createClient } from "next-sanity";

import { client } from "./client";
import { token } from "./token";

/**
 * Use createClient to enable automatic revalidation and refreshing of your fetched content
 * Learn more: https://github.com/sanity-io/next-sanity
 */

// Create a client with live preview capabilities
const liveClient = createClient({
  ...client.config(),
  token: token,
  useCdn: false, // Use the live API for real-time updates
  stega: {
    enabled: true,
    studioUrl: "/studio",
  },
});

// Export the client
export const sanityFetch = liveClient.fetch.bind(liveClient);
