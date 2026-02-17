"use client";

import Image from "next/image";

import type { YouTubeVideo } from "@/lib/youtube";
import { cleanVideoTitle, formatVideoDate } from "@/lib/youtube";

interface SermonArchiveProps {
  videos: YouTubeVideo[];
  skipFirst?: boolean;
}

export default function SermonArchive({
  videos,
  skipFirst = false,
}: SermonArchiveProps) {
  const displayedVideos = skipFirst ? videos.slice(1) : videos;

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary md:text-4xl">
            Recent Sermons
          </h2>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-24 rounded-full bg-primary" />
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {displayedVideos.map((video) => (
            <a
              key={video.videoId}
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              rel="noopener noreferrer"
              target="_blank"
              className="group block overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all duration-300 hover:shadow-lg"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <Image
                  alt={cleanVideoTitle(video.title)}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  src={video.thumbnailUrl}
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                  <div className="rounded-full bg-white/90 p-3 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <svg
                      className="h-8 w-8 fill-current text-primary"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="mb-2 text-sm text-muted-foreground">
                  {formatVideoDate(video.publishedAt)}
                </p>
                <h3 className="line-clamp-2 text-lg font-semibold text-primary transition-colors group-hover:text-primary/80">
                  {cleanVideoTitle(video.title)}
                </h3>
              </div>
            </a>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <a
            className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-lg font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            href="https://www.youtube.com/@spiritoflifekearney"
            rel="noopener noreferrer"
            target="_blank"
          >
            View All Sermons
          </a>
        </div>
      </div>
    </section>
  );
}
