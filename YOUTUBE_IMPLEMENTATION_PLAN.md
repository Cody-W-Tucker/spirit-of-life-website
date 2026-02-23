# YouTube Implementation Plan

**Goal:** Port Moses Hill's YouTube functionality to Spirit of Life, using Spirit of Life's design system (colors, spacing, components).

**Status:** Ready for implementation

---

## Prerequisites

1. **YouTube Data API Key** - Obtain from Google Cloud Console
2. **YouTube Channel ID** - Spirit of Life's channel ID
3. **Channel URL** - For subscribe links (e.g., `https://www.youtube.com/@spiritoflifekearney`)

---

## Architecture Overview

**Moses Hill Pattern (what we're copying):**

```
YouTube API v3 → lib/youtube.ts (data fetching) → VideoArchive.tsx (grid display) → page.tsx (integration)
```

**Spirit of Life Adaptation:**

```
YouTube API v3 → apps/web/src/lib/youtube.ts (data fetching)
                              ↓
              apps/web/src/components/sermon-archive.tsx (grid with Spirit of Life styling)
                              ↓
              apps/web/src/app/page.tsx or CMS page (integration)
```

---

## Files to Create/Modify

### 1. Environment Variables (turbo.json)

**File:** `/home/codyt/Projects/spirit-of-life-website/turbo.json`

Add to `globalEnv` array:

```json
"YOUTUBE_API_KEY",
"YOUTUBE_CHANNEL_ID"
```

Also add to `.envrc` or `.env.local`:

```bash
YOUTUBE_API_KEY=your_api_key_here
YOUTUBE_CHANNEL_ID=your_channel_id_here
```

---

### 2. YouTube API Utility (apps/web/src/lib/youtube.ts) - NEW

**Copy from moses-hill:** `moses-hill-website/nextjs-app/lib/youtube.ts`

**Create:** `apps/web/src/lib/youtube.ts`

```typescript
/**
 * YouTube Data Fetching Utility
 * Fetches latest videos from a specified channel using YouTube Data API v3.
 */

/**
 * Clean up YouTube video title by parsing HTML entities and common symbols
 */
export function cleanVideoTitle(title: string): string {
  return title
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
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
```

---

### 3. Sermon Archive Component (apps/web/src/components/sermon-archive.tsx) - NEW

**Base on moses-hill:** `moses-hill-website/nextjs-app/app/components/VideoArchive.tsx`

**Create:** `apps/web/src/components/sermon-archive.tsx`

```typescript
"use client";

import Image from "next/image";
import type { YouTubeVideo } from "@/lib/youtube";
import { cleanVideoTitle, formatVideoDate } from "@/lib/youtube";

interface SermonArchiveProps {
  videos: YouTubeVideo[];
  skipFirst?: boolean;
}

export default function SermonArchive({ videos, skipFirst = false }: SermonArchiveProps) {
  const displayedVideos = skipFirst ? videos.slice(1) : videos;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Recent Sermons
          </h2>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-24 bg-primary rounded-full" />
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayedVideos.map((video) => (
            <a
              key={video.videoId}
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-border"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={video.thumbnailUrl}
                  alt={cleanVideoTitle(video.title)}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-primary fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-2">
                  {formatVideoDate(video.publishedAt)}
                </p>
                <h3 className="text-lg font-semibold text-primary line-clamp-2 group-hover:text-primary/80 transition-colors">
                  {cleanVideoTitle(video.title)}
                </h3>
              </div>
            </a>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <a
            href="https://www.youtube.com/@spiritoflifekearney"  {/* UPDATE WITH ACTUAL URL */}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary/90 transition-colors"
          >
            View All Sermons
          </a>
        </div>
      </div>
    </section>
  );
}
```

**Spirit of Life styling adaptations:**

| Moses Hill Style | Spirit of Life Equivalent |
| ---------------- | ------------------------- |
| `bg-[#EAE2CD]`   | `bg-card`                 |
| `text-[#10331A]` | `text-primary`            |
| `bg-[#10331A]`   | `bg-primary`              |
| `text-white`     | `text-primary-foreground` |
| `rounded-lg`     | `rounded-xl`              |
| Custom colors    | CSS variables             |

---

### 4. Featured Sermon Component (apps/web/src/components/featured-sermon.tsx) - NEW

**Base on moses-hill:** `moses-hill-website/nextjs-app/app/page.tsx` (lines 104-121)

**Create:** `apps/web/src/components/featured-sermon.tsx`

```typescript
import type { YouTubeVideo } from "@/lib/youtube";
import { cleanVideoTitle, formatVideoDate } from "@/lib/youtube";

interface FeaturedSermonProps {
  video: YouTubeVideo;
}

export default function FeaturedSermon({ video }: FeaturedSermonProps) {
  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Latest Sermon
            </h2>
          </div>

          {/* Video Player */}
          <div className="relative aspect-video bg-card rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Video Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {formatVideoDate(video.publishedAt)}
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-6">
              {cleanVideoTitle(video.title)}
            </h3>
            <a
              href="https://www.youtube.com/@spiritoflifekearney"  {/* UPDATE WITH ACTUAL URL */}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Subscribe on YouTube
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

### 5. Next.js Config (apps/web/next.config.ts) - MODIFY

**File:** `/home/codyt/Projects/spirit-of-life-website/apps/web/next.config.ts`

Add YouTube image domains to the `images.remotePatterns` array:

```typescript
images: {
  minimumCacheTTL: 31536000,
  remotePatterns: [
    {
      protocol: "https",
      hostname: "cdn.sanity.io",
      pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/**`,
    },
    // Add these for YouTube thumbnails:
    {
      protocol: "https",
      hostname: "img.youtube.com",
      pathname: "/vi/**",
    },
    {
      protocol: "https",
      hostname: "i.ytimg.com",
      pathname: "/vi/**",
    },
  ],
},
```

---

### 6. Homepage Integration (apps/web/src/app/page.tsx) - MODIFY

**File:** `/home/codyt/Projects/spirit-of-life-website/apps/web/src/app/page.tsx`

Add imports at top:

```typescript
import { getLatestYouTubeVideos } from "@/lib/youtube";
import FeaturedSermon from "@/components/featured-sermon";
import SermonArchive from "@/components/sermon-archive";
```

Add data fetching in the async function (before return):

```typescript
export default async function Home() {
  // ... existing data fetching ...

  // Fetch YouTube videos
  const latestYouTubeVideos = await getLatestYouTubeVideos(7);
  const latestVideo = latestYouTubeVideos[0] ?? null;

  // ... rest of component
}
```

Add components in the JSX (placement depends on design preference):

```tsx
<PageBuilder
  pageBuilder={homePage?.pageBuilder}
  id={homePage?._id}
  type={homePage?._type}
/>;

{
  /* YouTube Sermon Sections */
}
{
  latestVideo && <FeaturedSermon video={latestVideo} />;
}
{
  latestYouTubeVideos.length > 1 && (
    <SermonArchive videos={latestYouTubeVideos} skipFirst />
  );
}
```

---

## Design System Mapping

### Colors

| Element                     | Tailwind Class                       | CSS Variable                    |
| --------------------------- | ------------------------------------ | ------------------------------- |
| Section background (light)  | `bg-background`                      | --background                    |
| Section background (accent) | `bg-muted`                           | --muted                         |
| Card background             | `bg-card`                            | --card                          |
| Primary text (headings)     | `text-primary`                       | --primary                       |
| Muted text (dates)          | `text-muted-foreground`              | --muted-foreground              |
| Buttons                     | `bg-primary text-primary-foreground` | --primary, --primary-foreground |
| Borders                     | `border-border`                      | --border                        |

### Typography

| Element        | Classes                                           |
| -------------- | ------------------------------------------------- |
| Section titles | `text-3xl md:text-4xl font-bold text-primary`     |
| Video titles   | `text-lg font-semibold text-primary line-clamp-2` |
| Dates/metadata | `text-sm text-muted-foreground`                   |
| Buttons        | `text-lg font-medium`                             |

### Spacing

| Element         | Classes                          |
| --------------- | -------------------------------- |
| Section padding | `py-16 md:py-24`                 |
| Container       | `container mx-auto px-4 md:px-8` |
| Grid gap        | `gap-6 md:gap-8`                 |
| Card padding    | `p-6`                            |
| Section margins | `mb-12`, `mt-12`                 |

### Effects

| Element           | Classes                                                   |
| ----------------- | --------------------------------------------------------- |
| Card shadow       | `shadow-md hover:shadow-lg`                               |
| Card border       | `border border-border rounded-xl`                         |
| Hover transitions | `transition-all duration-300`                             |
| Play button       | `bg-white/90 backdrop-blur-sm rounded-full`               |
| Image zoom        | `group-hover:scale-105 transition-transform duration-300` |

---

## Implementation Steps

1. [ ] **Add env vars** to `turbo.json`
2. [ ] **Set up environment** - Add YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID to `.envrc`
3. [ ] **Create youtube.ts** - Copy from moses-hill to `apps/web/src/lib/youtube.ts`
4. [ ] **Create sermon-archive.tsx** - Adapt VideoArchive.tsx styling
5. [ ] **Create featured-sermon.tsx** - Adapt page.tsx embedded player
6. [ ] **Update next.config.ts** - Add image domains
7. [ ] **Update page.tsx** - Integrate components
8. [ ] **Run type generation:** `cd apps/studio && pnpm type`
9. [ ] **Run lint:** `pnpm lint`
10. [ ] **Test locally:** `pnpm dev`

---

## Configuration Checklist

- [ ] YouTube Data API Key obtained from Google Cloud Console
- [ ] YouTube Channel ID identified (e.g., `UC...`)
- [ ] YouTube channel URL confirmed for subscribe links
- [ ] API quota limits understood (10,000 units/day default)
- [ ] Environment variables added to production deployment

---

## Notes

- No changes needed to Sanity CMS schema - this is purely frontend integration
- Videos are fetched server-side with 1-hour cache (revalidate: 3600)
- Graceful fallback if API key/channel ID not configured (returns empty array)
- Thumbnails use YouTube's img.youtube.com CDN
- Videos open on YouTube in new tab (same as moses-hill)
- Responsive design: 1 col mobile, 2 col tablet, 3 col desktop

---

**Last Updated:** 2026-02-17
**Based on:** moses-hill-website YouTube implementation
**Target:** spirit-of-life-website with Spirit of Life design system
