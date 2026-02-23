/**
 * YouTube Data Fetching Utility
 * Fetches latest videos from a specified channel using YouTube Data API v3.
 */

/**
 * Clean up YouTube video title by parsing HTML entities, common symbols, and removing date prefixes
 */
export function cleanVideoTitle(title: string): string {
  return (
    title
      // Remove date prefixes like "12-21-25", "12/21/25", "12-21-2025", "Dec 21, 2025", etc.
      .replace(/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\s*/, "")
      // Remove date prefixes like "December 21, 2025", "Dec 21, 2025", "21 December 2025"
      .replace(
        /^(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}\s*/i,
        "",
      )
      // Remove European format: "21 December 2025"
      .replace(
        /^\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*/i,
        "",
      )
      // HTML entities
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .trim()
  );
}

/**
 * Format date for display in a human-readable format
 */
export function formatVideoDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  description?: string;
}

/**
 * Retrieve the latest YouTube videos from a channel.
 * Uses Next.js fetch caching with a 1-hour revalidation.
 * @param maxResults Number of videos to fetch (default: 6)
 */
export async function getLatestYouTubeVideos(
  maxResults: number = 6,
): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    console.warn("YouTube API key or Channel ID is missing.");
    return [];
  }

  // Use the search endpoint to get the most recent uploads
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("channelId", channelId);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("order", "date");
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("type", "video");

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });

  if (!res.ok) {
    console.error("YouTube API request failed:", res.status, res.statusText);
    return [];
  }

  const data = await res.json();

  if (!Array.isArray(data.items)) {
    return [];
  }

  return data.items.map((item: any) => ({
    videoId: item.id.videoId as string,
    title: item.snippet.title as string,
    thumbnailUrl:
      item.snippet.thumbnails?.high?.url ||
      item.snippet.thumbnails?.medium?.url ||
      item.snippet.thumbnails?.default?.url ||
      "",
    publishedAt: item.snippet.publishedAt as string,
    description: item.snippet.description as string,
  }));
}
