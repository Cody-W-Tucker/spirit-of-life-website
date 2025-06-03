import Image from "next/image";
import Link from "next/link";

import type { Maybe, SanityImageProps } from "@/types";

import { SanityImage } from "./sanity-image";

const LOGO_URL =
  "https://cdn.sanity.io/images/s6kuy1ts/production/68c438f68264717e93c7ba1e85f1d0c4b58b33c2-1200x621.svg";

interface LogoProps {
  src?: Maybe<string>;
  image?: Maybe<SanityImageProps>;
  alt?: Maybe<string>;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function Logo({
  src,
  alt = "logo",
  image,
  width,
  height,
  priority = true,
}: LogoProps) {
  // Default aspect ratio
  let aspectRatio = 3 / 1; 
  let imgW: number | undefined;
  let imgH: number | undefined;

  if (image?.dimensions) {
    imgW = image.dimensions.width;
    imgH = image.dimensions.height;
    if (typeof imgW === "number" && typeof imgH === "number" && imgH !== 0) {
      aspectRatio = imgW / imgH;
    }
  }

  // Dynamically calculate width/height
  let finalWidth = width;
  let finalHeight = height;
  if (width && !height) {
    finalHeight = width / aspectRatio;
  } else if (height && !width) {
    finalWidth = height * aspectRatio;
  } else if (!width && !height) {
    finalWidth = 170;
    finalHeight = 170 / aspectRatio;
  }

  // Round to nearest integer to avoid CDN errors
  finalWidth = Math.round(finalWidth ?? 0);
  finalHeight = Math.round(finalHeight ?? 0);

  return (
    <Link href="/" className="h-full flex items-center">
      <div
        style={{
          width: finalWidth,
          maxHeight: 84,
          overflow: "hidden",
        }}
        className="h-full flex items-center"
      >
        {image ? (
          <SanityImage
            asset={image}
            alt={alt ?? "logo"}
            width={finalWidth}
            height={finalHeight}
            className="h-full w-auto object-contain"
            priority={priority}
            loading="eager"
            decoding="sync"
            quality={100}
          />
        ) : (
          <Image
            src={src ?? LOGO_URL}
            alt={alt ?? "logo"}
            width={finalWidth}
            height={finalHeight}
            className="h-full w-auto object-contain"
            loading="eager"
            priority={priority}
            decoding="sync"
          />
        )}
      </div>
    </Link>
  );
}
