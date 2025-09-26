"use client";

import { useOptimistic } from "@sanity/visual-editing/react";
import { createDataAttribute } from "next-sanity";
import { useCallback, useMemo } from "react";

import { dataset, projectId, studioUrl } from "@/config";
import type { QueryHomePageDataResult } from "@/lib/sanity/sanity.types";
import type { PageBuilderBlockTypes, PagebuilderType } from "@/types";

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

// More specific and descriptive type aliases
type PageBuilderBlock = NonNullable<
  NonNullable<QueryHomePageDataResult>["pageBuilder"]
>[number];

export interface PageBuilderProps {
  readonly pageBuilder?: PageBuilderBlock[];
  readonly id: string;
  readonly type: string;
}

interface PageData {
  readonly _id: string;
  readonly _type: string;
  readonly pageBuilder?: PageBuilderBlock[];
}

interface SanityDataAttributeConfig {
  readonly id: string;
  readonly type: string;
  readonly path: string;
}

// Component mapping for page builder blocks
const BLOCK_COMPONENTS = {
  authorSection: AuthorSection,
  contentSection: ContentSection,
  cta: CTABlock,
  eventsList: EventsListSection,
  faqAccordion: FaqAccordion,
  fullpageImage: FullpageImageBlock,
  hero: HeroBlock,
  featureCardsIcon: FeatureCardsWithIcon,
  scheduleBar: ScheduleBar,
  subscribeNewsletter: SubscribeNewsletter,
  imageLinkCards: ImageLinkCards,
  videoLibrary: VideoLibrary,
} as const;

/**
 * Helper function to create consistent Sanity data attributes
 */
function createSanityDataAttribute(config: SanityDataAttributeConfig): string {
  return createDataAttribute({
    id: config.id,
    baseUrl: studioUrl,
    projectId,
    dataset,
    type: config.type,
    path: config.path,
  }).toString();
}

/**
 * Error fallback component for unknown block types
 */
function UnknownBlockError({
  blockType,
  blockKey,
}: {
  blockType: string;
  blockKey: string;
}) {
  return (
    <div
      key={`${blockType}-${blockKey}`}
      className="flex items-center justify-center p-8 text-center text-muted-foreground bg-muted rounded-lg border-2 border-dashed border-muted-foreground/20"
      role="alert"
      aria-label={`Unknown block type: ${blockType}`}
    >
      <div className="space-y-2">
        <p>Component not found for block type:</p>
        <code className="font-mono text-sm bg-background px-2 py-1 rounded">
          {blockType}
        </code>
      </div>
    </div>
  );
}

/**
 * Hook to handle optimistic updates for page builder blocks
 */
function useOptimisticPageBuilder(
  initialBlocks: PageBuilderBlock[],
  documentId: string,
) {
  return useOptimistic<PageBuilderBlock[], any>(
    initialBlocks,
    (currentBlocks, action) => {
      if (action.id === documentId && action.document?.pageBuilder) {
        return action.document.pageBuilder;
      }
      return currentBlocks;
    },
  );
}

/**
 * Custom hook for block component rendering logic
 */
function useBlockRenderer(id: string, type: string) {
  const createBlockDataAttribute = useCallback(
    (blockKey: string) =>
      createSanityDataAttribute({
        id,
        type,
        path: `pageBuilder[_key=="${blockKey}"]`,
      }),
    [id, type],
  );

  const renderBlock = useCallback(
    (block: PageBuilderBlock, index: number) => {
      const Component =
        BLOCK_COMPONENTS[block._type as keyof typeof BLOCK_COMPONENTS];

      if (!Component) {
        return (
          <UnknownBlockError
            key={`${block._type}-${block._key}`}
            blockType={block._type}
            blockKey={block._key}
          />
        );
      }

      return (
        <div
          key={`${block._type}-${block._key}`}
          data-sanity={createBlockDataAttribute(block._key)}
        >
          {/* @ts-ignore - Component type inference issue */}
          <Component {...(block as any)} />
        </div>
      );
    },
    [createBlockDataAttribute],
  );

  return { renderBlock };
}

/**
 * PageBuilder component for rendering dynamic content blocks from Sanity CMS
 */
export function PageBuilder({
  pageBuilder: initialBlocks = [],
  id,
  type,
}: PageBuilderProps) {
  const blocks = useOptimisticPageBuilder(initialBlocks, id);
  const { renderBlock } = useBlockRenderer(id, type);

  const containerDataAttribute = useMemo(
    () => createSanityDataAttribute({ id, type, path: "pageBuilder" }),
    [id, type],
  );

  if (!blocks.length) {
    return null;
  }

  return (
    <section
      className="flex flex-col gap-16 my-16 max-w-7xl mx-auto"
      data-sanity={containerDataAttribute}
      aria-label="Page content"
    >
      {blocks.map(renderBlock)}
    </section>
  );
}
