import type { ReactElement } from "react";

import type { PagebuilderType } from "@/types";

import { SanityImage } from "../sanity-image";

export type FullpageImageBlockProps = PagebuilderType<"fullpageImage">;

export function FullpageImageBlock({
  image,
  overlayText,
}: FullpageImageBlockProps): ReactElement {
  // Fix: always pass a dimensions property, mapping null to undefined
  let imageWithFixedDimensions = image;
  if (image && "dimensions" in image) {
    imageWithFixedDimensions = {
      ...image,
      dimensions: image.dimensions === null ? null : image.dimensions,
    };
  }

  return (
    <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {image && (
        <SanityImage
          asset={imageWithFixedDimensions}
          loading="eager"
          width={1920}
          height={1080}
          priority
          quality={90}
          sizes="100vw"
          className="absolute inset-0 w-full h-full object-cover object-top z-0"
        />
      )}

      {/* Colored bar overlay on top */}
      <div
        className="absolute top-0 left-0 right-0 h-4 bg-brand-primary z-20"
        aria-hidden="true"
      />

      {overlayText && (
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
          {overlayText && (
            <h1 className="text-white text-4xl md:text-6xl font-bold drop-shadow-lg mb-6">
              {overlayText}
            </h1>
          )}
        </div>
      )}

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-5" aria-hidden="true" />
    </section>
  );
}
