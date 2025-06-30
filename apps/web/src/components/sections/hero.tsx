import { Badge } from "@workspace/ui/components/badge";
import type { FC } from "react";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityButtons } from "../sanity-buttons";
import { SanityImage } from "../sanity-image";

type HeroBlockProps = PagebuilderType<"hero">;

// Reusable image component
const HeroImage: FC<{
  asset: NonNullable<HeroBlockProps["images"]>[number];
  width: number;
  height: number;
}> = ({ asset, width, height }) => (
  <div className="relative">
    <SanityImage
      asset={asset}
      width={width}
      height={height}
      className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
    />
    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
  </div>
);

// Layout configurations for different image counts
const imageLayouts = {
  1: {
    container:
      "mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0",
    columns: [{ className: "w-80 flex-none", images: [0] }],
  },
  2: {
    container:
      "mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0",
    columns: [
      {
        className: "w-60 flex-none space-y-8 pt-32 sm:pt-80 lg:pt-36",
        images: [0],
      },
      { className: "w-60 flex-none space-y-8 sm:pt-52 lg:pt-16", images: [1] },
    ],
  },
  3: {
    container:
      "mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0",
    columns: [
      {
        className: "w-48 flex-none space-y-8 pt-32 sm:pt-80 lg:pt-36",
        images: [0],
      },
      { className: "w-48 flex-none space-y-8 sm:pt-52 lg:pt-16", images: [1] },
      {
        className: "w-48 flex-none space-y-8 pt-32 sm:pt-0 lg:pt-32",
        images: [2],
      },
    ],
  },
  4: {
    container:
      "mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0",
    columns: [
      {
        className: "w-44 flex-none space-y-6 pt-32 sm:pt-80 lg:pt-36",
        images: [0, 1],
      },
      {
        className: "w-44 flex-none space-y-6 sm:pt-52 lg:pt-16",
        images: [2, 3],
      },
    ],
  },
  5: {
    container:
      "mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0",
    columns: [
      {
        className:
          "ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80",
        images: [0],
      },
      {
        className: "mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36",
        images: [1, 2],
      },
      { className: "w-44 flex-none space-y-8 pt-32 sm:pt-0", images: [3, 4] },
    ],
  },
} as const;

// Dynamic image layout component
const HeroImages: FC<{ images: NonNullable<HeroBlockProps["images"]> }> = ({
  images,
}) => {
  const count = Math.min(images.length, 5) as keyof typeof imageLayouts;
  const layout = imageLayouts[count];

  if (!layout) return null;

  return (
    <div className={layout.container}>
      {layout.columns.map((column, columnIndex) => (
        <div key={columnIndex} className={column.className}>
          {column.images.map((imageIndex) => {
            const image = images[imageIndex];
            return image ? (
              <HeroImage
                key={imageIndex}
                asset={image}
                width={count === 1 ? 320 : count === 2 ? 240 : 176}
                height={count === 1 ? 480 : count === 2 ? 360 : 264}
              />
            ) : null;
          })}
        </div>
      ))}
    </div>
  );
};

export const HeroBlock: FC<HeroBlockProps> = ({
  title,
  buttons,
  badge,
  images,
  richText,
}: HeroBlockProps) => {
  return (
    <div className="bg-white">
      <div className="relative isolate">
        <svg
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
            width="100%"
            height="100%"
            strokeWidth={0}
          />
        </svg>
        <div
          aria-hidden="true"
          className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
        >
          <div
            style={{
              clipPath:
                "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
            }}
            className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#007458] via-[#FFFFFF] to-[#404040] opacity-30"
          />
        </div>
        <div className="overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 pb-32 pt-24 sm:pt-32 lg:px-8 lg:pt-32">
            <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
              <div className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl">
                {badge && (
                  <Badge variant="secondary" className="mb-8">
                    {badge}
                  </Badge>
                )}
                <h1 className="text-pretty text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                  {title}
                </h1>
                {richText && (
                  <div className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:max-w-md sm:text-xl/8 lg:max-w-none">
                    <RichText richText={richText} />
                  </div>
                )}
                {buttons && buttons.length > 0 && (
                  <div className="mt-10">
                    <SanityButtons
                      buttons={buttons}
                      className="flex items-center gap-x-6"
                    />
                  </div>
                )}
              </div>

              {images && images.length > 0 && <HeroImages images={images} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
