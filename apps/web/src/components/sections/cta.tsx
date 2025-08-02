import { Badge } from "@workspace/ui/components/badge";
import type { FC } from "react";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityButtons } from "../sanity-buttons";

export type CTABlockProps = PagebuilderType<"cta">;

export const CTABlock: FC<CTABlockProps> = ({
  richText,
  title,
  eyebrow,
  buttons,
}) => {
  return (
    <section id="features" className="section-spacing-tight">
      <div className="container mx-auto px-4 md:px-8">
        <div className="bg-muted py-16 rounded-3xl px-4">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            {eyebrow && (
              <Badge variant="secondary" className="bg-zinc-200">
                {eyebrow}
              </Badge>
            )}
            <h2 className="heading-2 text-balance">
              {title}
            </h2>
            <div className="text-lg text-muted-foreground">
              <RichText richText={richText} className="text-balance" />
            </div>
            <div className="flex justify-center">
              <SanityButtons
                buttons={buttons}
                buttonClassName="w-full sm:w-auto"
                className="w-full sm:w-fit grid gap-2 sm:grid-flow-col lg:justify-start mb-8"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
