import { Badge } from "@workspace/ui/components/badge";
import type { FC } from "react";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityImage } from "../sanity-image";

type ContentSectionProps = PagebuilderType<"contentSection">;

// Reusable image component
const ContentImage: FC<{
  asset: NonNullable<ContentSectionProps["images"]>[number];
  width: number;
  height: number;
}> = ({ asset, width, height }) => (
  <div className="relative">
    <SanityImage
      asset={asset}
      width={width}
      height={height}
      className="aspect-square w-full rounded-xl shadow-xl outline outline-1 -outline-offset-1 outline-black/10 object-cover"
    />
    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
  </div>
);

// Layout configurations for different image counts
const imageLayouts = {
  1: {
    container:
      "-mx-8 flex justify-center gap-4 sm:-mx-16 lg:mx-0 lg:gap-4 xl:gap-8",
    columns: [{ className: "w-80 max-w-md", images: [0] }],
  },
  2: {
    container:
      "-mx-8 grid grid-cols-2 gap-6 sm:-mx-16 lg:mx-0 lg:gap-8 xl:gap-12",
    columns: [
      { className: "", images: [0] },
      { className: "-mt-8 lg:-mt-40", images: [1] },
    ],
  },
  3: {
    container:
      "-mx-8 grid grid-cols-2 gap-4 sm:-mx-16 sm:grid-cols-3 lg:mx-0 lg:grid-cols-2 lg:gap-6 xl:gap-8",
    columns: [
      { className: "", images: [0] },
      { className: "-mt-8 lg:-mt-40", images: [1] },
      { className: "", images: [2] },
    ],
  },
  4: {
    container:
      "-mx-8 grid grid-cols-2 gap-4 sm:-mx-16 sm:grid-cols-4 lg:mx-0 lg:grid-cols-2 lg:gap-4 xl:gap-8",
    columns: [
      { className: "", images: [0] },
      { className: "-mt-8 lg:-mt-40", images: [1] },
      { className: "", images: [2] },
      { className: "-mt-8 lg:-mt-40", images: [3] },
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
    <div className="pt-16 lg:row-span-2 lg:-mr-16 xl:mr-auto">
      <div className={layout.container}>
        {layout.columns.map((column, columnIndex) => (
          <div key={columnIndex} className={column.className}>
            {column.images.map((imageIndex) => {
              const image = images[imageIndex];
              return image ? (
                <ContentImage
                  key={imageIndex}
                  asset={image}
                  width={count === 1 ? 320 : 280}
                  height={count === 1 ? 320 : 280}
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
  richText,
  images,
}) => {
  return (
    <div className="overflow-hidden bg-background section-spacing">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <div className="max-w-4xl">
          {eyebrow && (
            <Badge variant="secondary" className="mb-8">
              {eyebrow}
            </Badge>
          )}
          {title && <h1 className="mt-2 text-pretty heading-2">{title}</h1>}
        </div>

        <section className="mt-20 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-16">
          {/* Content Section */}
          <div className="lg:pr-8">
            {richText && (
              <RichText
                richText={richText}
                className="text-base/7 text-muted-foreground"
              />
            )}
          </div>

          {/* Image Grid */}
          {images && Array.isArray(images) && images.length > 0 && (
            <ContentImages images={images} />
          )}
        </section>
      </div>
    </div>
  );
};
