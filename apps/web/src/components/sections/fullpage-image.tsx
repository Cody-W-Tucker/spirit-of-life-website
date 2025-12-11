import { getImageDimensions } from "@sanity/asset-utils";
import type { ReactElement } from "react";

import type { PagebuilderType } from "@/types";

import { SanityButtons } from "../sanity-buttons";
import { SanityImage } from "../sanity-image";

export type FullpageImageBlockProps = PagebuilderType<"fullpageImage">;

export function FullpageImageBlock({
  image,
  overlayText,
  button,
}: FullpageImageBlockProps): ReactElement {
  // Fix: always pass a dimensions property, mapping null to undefined
  let imageWithFixedDimensions = image;
  if (image && "dimensions" in image) {
    imageWithFixedDimensions = {
      ...image,
      dimensions: image.dimensions === null ? null : image.dimensions,
    };
  }

  const dims = image?.asset ? getImageDimensions(image.asset) : null;
  const width = 1920;
  const height = dims ? Math.round(width / dims.aspectRatio) : 1080;

  return (
    <section className="relative w-full max-h-screen flex items-center justify-center overflow-hidden">
      {image && (
        <SanityImage
          asset={imageWithFixedDimensions}
          loading="eager"
          width={width}
          height={height}
          priority
          quality={90}
          sizes="100vw"
          className="w-full h-auto z-0"
        />
      )}

      {/* Colored bar overlay on top */}
      <div
        className="absolute top-0 left-0 right-0 h-4 bg-brand-primary z-20"
        aria-hidden="true"
      />

      {overlayText && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
          {overlayText && (
            <h1 className="text-white text-4xl md:text-6xl font-bold drop-shadow-lg mb-6">
              {overlayText}
            </h1>
          )}
          {button && (
            <div className="flex justify-center">
              <SanityButtons
                buttons={[
                  { ...button, _key: button._key || "fullpage-button" },
                ]}
                buttonClassName="w-full sm:w-auto"
                className="w-full sm:w-fit"
              />
            </div>
          )}
        </div>
      )}

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-5" aria-hidden="true" />
    </section>
  );
}
