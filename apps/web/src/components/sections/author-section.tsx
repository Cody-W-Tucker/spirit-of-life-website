import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import type { FC } from "react";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityImage } from "../sanity-image";

type AuthorSectionProps = PagebuilderType<"authorSection">;

interface AuthorCardProps {
  author: NonNullable<AuthorSectionProps["authors"]>[number];
}

const AuthorCard: FC<AuthorCardProps> = ({ author }) => {
  if (!author) return null;

  return (
    <div className="flex flex-col items-center text-center group">
      {/* Author Image */}
      <div className="relative mb-6 w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
        {author.image ? (
          <SanityImage
            asset={author.image}
            width={256}
            height={256}
            className="w-full h-full object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted rounded-2xl flex items-center justify-center shadow-lg">
            <div className="text-muted-foreground text-6xl">
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Author Info */}
      <div className="space-y-3">
        <h3 className="text-xl lg:text-2xl font-semibold text-foreground">
          {author.name}
        </h3>
        
        {author.position && (
          <p className="text-brand-primary font-medium text-sm lg:text-base">
            {author.position}
          </p>
        )}

        {author.bio && (
          <div className="text-muted-foreground text-sm lg:text-base max-w-sm mx-auto">
            <RichText richText={author.bio} />
          </div>
        )}
      </div>
    </div>
  );
};

// Grid layout configurations for different author counts
const getGridConfig = (count: number) => {
  switch (count) {
    case 1:
      return "grid grid-cols-1 justify-items-center max-w-md mx-auto";
    case 2:
      return "grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-4xl mx-auto";
    case 3:
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 max-w-6xl mx-auto";
    default:
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 lg:gap-16 max-w-7xl mx-auto";
  }
};

export const AuthorSection: FC<AuthorSectionProps> = ({
  eyebrow,
  title,
  subtitle,
  authors = [],
}) => {
  // Filter out null/undefined authors
  const validAuthors = (authors || []).filter(Boolean);
  const authorCount = validAuthors.length;

  if (authorCount === 0) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <p className="text-muted-foreground">No authors selected</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        {(eyebrow || title || subtitle) && (
          <div className="text-center mb-16 lg:mb-20">
            {eyebrow && (
              <Badge variant="secondary" className="mb-4">
                {eyebrow}
              </Badge>
            )}
            
            {title && (
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4">
                {title}
              </h2>
            )}
            
            {subtitle && (
              <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Authors Grid */}
        <div className={cn(getGridConfig(authorCount))}>
          {validAuthors.map((author, index) => (
            <AuthorCard
              key={author._id || `author-${index}`}
              author={author}
            />
          ))}
        </div>
      </div>
    </section>
  );
}; 