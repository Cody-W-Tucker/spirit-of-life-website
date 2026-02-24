import type { YouTubeVideo } from "@/lib/youtube";
import { cleanVideoTitle, formatVideoDate } from "@/lib/youtube";

interface FeaturedSermonProps {
  video: YouTubeVideo;
}

export default function FeaturedSermon({ video }: FeaturedSermonProps) {
  return (
    <section className="bg-muted py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary md:text-4xl">
              Latest Sermon
            </h2>
          </div>

          {/* Video Player */}
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-card shadow-xl">
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${video.videoId}`}
              title={video.title}
            />
          </div>

          {/* Video Info */}
          <div className="mt-8 text-center">
            <p className="mb-2 text-sm text-muted-foreground">
              {formatVideoDate(video.publishedAt)}
            </p>
            <h3 className="mb-6 text-2xl font-bold text-primary md:text-3xl">
              {cleanVideoTitle(video.title)}
            </h3>
            <a
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-lg font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              href="https://www.youtube.com/@spiritoflifekearney"
              rel="noopener noreferrer"
              target="_blank"
            >
              Subscribe on YouTube
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
