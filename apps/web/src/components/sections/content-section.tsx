import { Badge } from "@workspace/ui/components/badge";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityImage } from "../sanity-image";

type ContentSectionProps = PagebuilderType<"contentSection">;

// Reusable image component with subtle parallax
const ContentImage: FC<{
  asset: NonNullable<ContentSectionProps["images"]>[number];
  width: number;
  height: number;
  count?: number;
}> = ({ asset, width, height, count }) => {
  const [offsetY, setOffsetY] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return;

      const rect = imageRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const elementTop = rect.top + scrollY;
      const windowHeight = window.innerHeight;

      // Calculate parallax offset (subtle effect)
      let parallaxOffset = (scrollY - elementTop + windowHeight) * 0.2;

      // Limit movement on mobile to prevent overlapping text
      if (window.innerWidth < 1024) {
        parallaxOffset = Math.min(parallaxOffset, 50);
      }

      setOffsetY(parallaxOffset);
    };

    // Throttle scroll events for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
        setTimeout(() => (ticking = false), 16); // ~60fps
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", throttledScroll);
  }, []);

  return (
    <div
      ref={imageRef}
      className="relative"
      style={{
        transform: `translateY(${offsetY}px)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      <SanityImage
        asset={asset}
        width={width}
        height={height}
        className={`${count === 1 ? "aspect-[4/3]" : "aspect-square"} w-full rounded-xl shadow-xl outline outline-1 -outline-offset-1 outline-black/10 object-cover`}
      />
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
    </div>
  );
};

// Layout configurations for different image counts
const imageLayouts = {
  1: {
    container:
      "-mx-6 flex justify-center gap-4 md:-mx-16 lg:mx-0 lg:gap-4 xl:gap-8",
    columns: [{ className: "w-full", images: [0] }],
  },
  2: {
    container:
      "-mx-6 grid grid-cols-2 gap-4 md:-mx-16 lg:mx-0 lg:gap-8 xl:gap-8",
    columns: [
      { className: "", images: [0] },
      { className: "mt-4 lg:mt-8", images: [1] },
    ],
  },
  3: {
    container:
      "-mx-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:-mx-16 lg:mx-0 lg:grid-cols-2 lg:gap-8 xl:gap-8",
    columns: [
      { className: "", images: [0] },
      { className: "mt-4 lg:mt-8", images: [1] },
      { className: "", images: [2] },
    ],
  },
  4: {
    container:
      "-mx-6 grid grid-cols-2 gap-4 sm:grid-cols-4 md:-mx-16 lg:mx-0 lg:grid-cols-2 lg:gap-8 xl:gap-8",
    columns: [
      { className: "", images: [0] },
      { className: "mt-4 lg:mt-8", images: [1] },
      { className: "", images: [2] },
      { className: "mt-4 lg:mt-8", images: [3] },
    ],
  },
} as const;

// Dynamic image layout component
const ContentImages: FC<{
  images: NonNullable<ContentSectionProps["images"]>;
}> = ({ images }) => {
  const count = Math.min(images.length, 4) as keyof typeof imageLayouts;
  const layout = imageLayouts[count];

  if (!layout) return null;

  return (
    <div
      className={
        count === 1
          ? "lg:row-span-2"
          : "pt-16 lg:row-span-2 lg:-mr-8 xl:mr-auto"
      }
    >
      <div className={layout.container}>
        {layout.columns.map((column, columnIndex) => (
          <div key={columnIndex} className={column.className}>
            {column.images.map((imageIndex) => {
              const image = images[imageIndex];
              return image ? (
                <ContentImage
                  key={imageIndex}
                  asset={image}
                  width={count === 1 ? 1200 : 280}
                  height={count === 1 ? 800 : 280}
                  count={count}
                />
              ) : null;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ContentSection: FC<ContentSectionProps> = ({
  eyebrow,
  title,
  subtitle,
  richText,
  images,
}) => {
  return (
    <div className="relative section-spacing">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        {/* Header with proper z-index */}
        <div className="relative z-20 max-w-4xl">
          {eyebrow && (
            <Badge variant="secondary" className="mb-8">
              {eyebrow}
            </Badge>
          )}
          {title && <h1 className="mt-2 text-pretty heading-2">{title}</h1>}
          {subtitle && (
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>

        <section className="relative mt-20 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-16 lg:min-h-[600px]">
          {/* Content Section with proper z-index */}
          <div className="relative z-10 lg:pr-8">
            {richText && (
              <RichText
                richText={richText}
                className="text-base/7 text-muted-foreground"
              />
            )}
          </div>

          {/* Image Grid with lower z-index */}
          {images && Array.isArray(images) && images.length > 0 && (
            <div className="relative z-0 lg:sticky lg:top-10 lg:self-start">
              <ContentImages images={images} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
