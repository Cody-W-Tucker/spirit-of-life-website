import type {
  QueryBlogSlugPageDataResult,
  QueryHomePageDataResult,
  QueryImageTypeResult,
} from "@/lib/sanity/sanity.types";

export type PageBuilderBlockTypes =
  | NonNullable<
    NonNullable<QueryHomePageDataResult>["pageBuilder"]
  >[number]["_type"]
  | "fullpageImage"
  | "scheduleBar"
  | "videoLibrary"
  | "authorSection"
  | "eventsList";

export type PagebuilderType<T extends PageBuilderBlockTypes> = Extract<
  NonNullable<NonNullable<QueryHomePageDataResult>["pageBuilder"]>[number],
  { _type: T }
>;

export type SanityButtonProps = NonNullable<
  NonNullable<PagebuilderType<"hero">>["buttons"]
>[number];

export type SanityImageProps = NonNullable<QueryImageTypeResult> & {
  dimensions?: {
    width?: number;
    height?: number;
    aspectRatio?: number;
  } | null;
};

export type SanityRichTextProps =
  NonNullable<QueryBlogSlugPageDataResult>["richText"];

export type SanityRichTextBlock = Extract<
  NonNullable<NonNullable<SanityRichTextProps>[number]>,
  { _type: "block" }
>;

export type Maybe<T> = T | null | undefined;
