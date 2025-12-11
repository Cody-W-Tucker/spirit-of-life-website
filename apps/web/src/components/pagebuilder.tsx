"use client";
import { useOptimistic } from "@sanity/visual-editing/react";
import { createDataAttribute, type SanityDocument } from "next-sanity";
import type { ComponentType } from "react";

import { dataset, projectId, studioUrl } from "@/lib/sanity/api";
import type { QueryHomePageDataResult } from "@/lib/sanity/sanity.types";
import type { PagebuilderType } from "@/types";

import { AuthorSection } from "./sections/author-section";
import { ContentSection } from "./sections/content-section";
import { CTABlock } from "./sections/cta";
import { EventsListSection } from "./sections/events-list";
import { FaqAccordion } from "./sections/faq-accordion";
import { FeatureCardsWithIcon } from "./sections/feature-cards-with-icon";
import { FullpageImageBlock } from "./sections/fullpage-image";
import { HeroBlock } from "./sections/hero";
import { ImageLinkCards } from "./sections/image-link-cards";
import { ScheduleBar } from "./sections/schedule-bar";
import { SubscribeNewsletter } from "./sections/subscribe-newsletter";
import { VideoLibrary } from "./sections/video-library";

type PageBlock = NonNullable<
  NonNullable<QueryHomePageDataResult>["pageBuilder"]
>[number];

export type PageBuilderProps = {
  pageBuilder: PageBlock[] | null | undefined;
  id: string;
  type: string;
};

type PageData = {
  _id: string;
  _type: string;
  pageBuilder?: PageBlock[];
};

const BLOCK_COMPONENTS = {
  authorSection: AuthorSection,
  contentSection: ContentSection,
  cta: CTABlock,
  faqAccordion: FaqAccordion,
  hero: HeroBlock,
  featureCardsIcon: FeatureCardsWithIcon,
  subscribeNewsletter: SubscribeNewsletter,
  imageLinkCards: ImageLinkCards,
  fullpageImage: FullpageImageBlock,
  scheduleBar: ScheduleBar,
  videoLibrary: VideoLibrary,
  eventsList: EventsListSection,
} as const;

type BlockType = keyof typeof BLOCK_COMPONENTS;

export function PageBuilder({
  pageBuilder: initialPageBuilder,
  id,
  type,
}: PageBuilderProps): React.ReactElement {
  const safeInitial = Array.isArray(initialPageBuilder)
    ? initialPageBuilder
    : [];
  const pageBuilder = useOptimistic<PageBlock[], SanityDocument<PageData>>(
    safeInitial,
    (currentPageBuilder, action) => {
      if (action.id === id && action.document.pageBuilder) {
        return action.document.pageBuilder;
      }

      return currentPageBuilder;
    },
  );

  return (
    <div className="flex flex-col [--section-gap:clamp(24px,4vw,64px)] gap-y-[var(--section-gap)] my-[var(--section-gap)]">
      {pageBuilder.map((block) => {
        const Component = BLOCK_COMPONENTS[block._type] as ComponentType<
          PagebuilderType<BlockType>
        >;

        if (!Component) {
          return (
            <div
              key={`${block._type}-${block._key}`}
              className="flex items-center justify-center p-8 text-center text-muted-foreground bg-muted rounded-lg max-w-7xl mx-auto"
            >
              Component not found for block type: <code>{block._type}</code>
            </div>
          );
        }

        // Check if this block needs full width (no container constraints)
        const isFullWidth =
          block._type === "fullpageImage" ||
          block._type === "scheduleBar" ||
          block._type === "hero" ||
          block._type === "contentSection" ||
          block._type === "cta";

        return (
          <div
            key={`${block._type}-${block._key}`}
            className={isFullWidth ? "" : "max-w-7xl mx-auto"}
            data-sanity={createDataAttribute({
              id: id,
              baseUrl: studioUrl,
              projectId: projectId,
              dataset: dataset,
              type: type,
              path: `pageBuilder[_key=="${block._key}"]`,
            }).toString()}
          >
            <Component {...block} />
          </div>
        );
      })}
    </div>
  );
}
