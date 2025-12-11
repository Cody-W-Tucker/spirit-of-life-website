import { PlayIcon } from "lucide-react";
import type { FC } from "react";

import type { PagebuilderType, SanityImageProps } from "@/types";

import { SanityImage } from "../sanity-image";

export type VideoLibraryProps = PagebuilderType<"videoLibrary">;

interface VideoCardProps {
  title: string;
  description?: string;
  videoUrl: string;
  thumbnail?: SanityImageProps;
  duration?: string;
  _type?: string;
}

const VideoCard: FC<VideoCardProps> = ({
  title,
  description,
  videoUrl,
  thumbnail,
  duration,
}) => {
  const handleVideoClick = () => {
    // For now, just open the URL in a new tab
    // In a real implementation, you might want to open a modal or embed player
    window.open(videoUrl, "_blank");
  };

  return (
    <div className="group cursor-pointer bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-video bg-muted">
        {thumbnail ? (
          <SanityImage
            asset={thumbnail}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10 flex items-center justify-center">
            <PlayIcon className="w-12 h-12 text-muted-foreground" />
          </div>
        )}

        {/* Play button overlay */}
        <div
          className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={handleVideoClick}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
            <PlayIcon className="w-8 h-8 text-foreground fill-current" />
          </div>
        </div>

        {/* Duration badge */}
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {duration}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-muted-foreground text-sm line-clamp-3">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export const VideoLibrary: FC<VideoLibraryProps> = ({
  title,
  subtitle,
  videos = [],
}) => {
  const videoSlots = Array.isArray(videos) ? videos : [];

  // Don't render section if no videos
  if (videoSlots.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          )}
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoSlots.map((video, index) => (
            <VideoCard
              key={video._key || `video-${index}`}
              title={video.title || `Video ${index + 1}`}
              description={video.description || undefined}
              videoUrl={video.videoUrl || "#"}
              thumbnail={video.thumbnail || undefined}
              duration={video.duration || undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
