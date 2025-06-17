import type { PagebuilderType } from "@/types";
import { SanityImage } from "../sanity-image";
import { SanityButtons } from "../sanity-buttons";
import type { ReactElement } from "react";
import { useId } from "react";

// Type for the new block
// @ts-ignore
// eslint-disable-next-line
// prettier-ignore
// If typegen is not yet run, fallback to any
// Remove @ts-ignore after typegen
// @ts-ignore
export type FullpageImageBlockProps = PagebuilderType<"fullpageImage">;

export function FullpageImageBlock({ image, overlayText, button }: FullpageImageBlockProps): ReactElement {
  const reactId = useId();
  // Fix: always pass a dimensions property, mapping null to undefined
  let imageWithFixedDimensions = image;
  if (image && 'dimensions' in image) {
    imageWithFixedDimensions = {
      ...image,
      dimensions: image.dimensions === null ? null : image.dimensions,
    };
  }
  // Fix: Ensure button has a _key (required by SanityButtons)
  const buttonWithKey = button && {
    ...button,
    _key: button._key || reactId,
  };
  return (
    <section className="relative w-full h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {image && (
        <SanityImage
          asset={imageWithFixedDimensions}
          loading="eager"
          width={1920}
          height={1080}
          priority
          quality={90}
          sizes="100vw"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}
      {(overlayText || button) && (
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
          {overlayText && (
            <h1 className="text-white text-4xl md:text-6xl font-bold drop-shadow-lg mb-6">
              {overlayText}
            </h1>
          )}
          {buttonWithKey && (
            <SanityButtons buttons={[buttonWithKey]} buttonClassName="px-8 py-4 text-lg" />
          )}
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 z-5" aria-hidden="true" />
    </section>
  );
} 