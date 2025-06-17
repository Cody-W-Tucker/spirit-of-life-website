import { cn } from "@workspace/ui/lib/utils";
import type { FC } from "react";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityImage } from "../sanity-image";

type ContentSectionProps = PagebuilderType<"contentSection">;

// Reusable image component
const ContentImage: FC<{ image: any; index: number; total: number }> = ({
  image,
  index,
  total,
}) => (
  <div
    className={cn(
      "aspect-square overflow-hidden rounded-xl shadow-xl outline outline-1 -outline-offset-1 outline-black/10",
      // Apply staggered heights for specific positions
      (total >= 2 && index % 2 === 1) && "-mt-8 lg:-mt-40"
    )}
  >
    <SanityImage
      asset={image}
      alt=""
      className="block size-full object-cover"
      sizes="560px"
    />
  </div>
);

// Layout configurations for different image counts
const imageLayouts = {
  1: {
    container: "-mx-8 flex justify-center gap-4 sm:-mx-16 lg:mx-0 lg:gap-4 xl:gap-8",
    itemClass: "w-80 max-w-md"
  },
  2: {
    container: "-mx-8 grid grid-cols-2 gap-6 sm:-mx-16 lg:mx-0 lg:gap-8 xl:gap-12",
    itemClass: ""
  },
  3: {
    container: "-mx-8 grid grid-cols-2 gap-4 sm:-mx-16 sm:grid-cols-3 lg:mx-0 lg:grid-cols-2 lg:gap-6 xl:gap-8",
    itemClass: ""
  },
  4: {
    container: "-mx-8 grid grid-cols-2 gap-4 sm:-mx-16 sm:grid-cols-4 lg:mx-0 lg:grid-cols-2 lg:gap-4 xl:gap-8",
    itemClass: ""
  }
} as const;

// Dynamic image layout component
const ContentImages: FC<{ images: NonNullable<ContentSectionProps["images"]> }> = ({ images }) => {
  const count = Math.min(images.length, 4) as keyof typeof imageLayouts;
  const layout = imageLayouts[count];
  
  if (!layout || images.length === 0) return null;

  return (
    <div className="pt-16 lg:row-span-2 lg:-mr-16 xl:mr-auto">
      <div className={layout.container}>
        {images.slice(0, 4).map((image, index) => (
          <div key={image._key || index} className={layout.itemClass}>
            <ContentImage
              image={image}
              index={index}
              total={count}
            />
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
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <div className="max-w-4xl">
          {eyebrow && (
            <p className="text-base/7 font-semibold text-indigo-600">{eyebrow}</p>
          )}
          {title && (
            <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              {title}
            </h1>
          )}
        </div>

        <section className="mt-20 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-16">
          {/* Content Section */}
          <div className="lg:pr-8">
            {richText && (
              <RichText
                richText={richText}
                className="text-base/7 text-gray-600"
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