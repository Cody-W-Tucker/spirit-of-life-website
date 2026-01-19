import Link from "next/link";
import type { FC } from "react";

import { computeNextOccurrence } from "@/lib/recurrence";
import type {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageDimensions,
  SanityImageHotspot,
} from "@/lib/sanity/sanity.types";

import { SanityImage } from "./sanity-image";

type Event = {
  _id: string;
  _type: "event";
  title: string | null;
  description: string | null;
  slug: string | null;
  image?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    dimensions: SanityImageDimensions | null;
    alt: string | "no-alt";
    blurData: string | null;
    dominantColor: string | null;
  };
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  occurrenceType?: "single" | "recurring" | null;
  recurrence?: {
    frequency?: string;
    interval?: number;
    byWeekday?: number[];
    byMonthday?: number[];
    monthlyMode?: string;
    weekOfMonth?: number;
    weekday?: number;
    until?: string;
    count?: number;
    exceptions?: string[];
  };
};

interface EventImageProps {
  image: Event["image"];
  title?: string | null;
}

function EventImage({ image, title }: EventImageProps) {
  if (!image?.asset) return null;

  return (
    <SanityImage
      asset={image}
      width={800}
      height={400}
      alt={title ?? "Event image"}
      className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
    />
  );
}

interface EventCardProps {
  event: Event;
}

function EventMeta({
  startDate,
  endDate,
  location,
}: {
  startDate: string | null;
  endDate: string | null;
  location: string | null;
}) {
  return (
    <div className="flex items-center gap-x-4 text-xs my-4">
      <time dateTime={startDate ?? ""} className="text-muted-foreground">
        {startDate
          ? new Date(startDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : ""}
      </time>
      {endDate && (
        <time dateTime={endDate} className="text-muted-foreground">
          -{" "}
          {new Date(endDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
      )}
      {location && <p className="text-muted-foreground">{location}</p>}
    </div>
  );
}

function EventContent({
  title,
  slug,
  description,
}: {
  title: string | null;
  slug: string | null;
  description: string | null;
}) {
  return (
    <div className="group relative">
      <h3 className="mt-3 text-lg font-semibold leading-6">
        <Link href={slug ? `/connect/event/${slug}` : "#"}>
          <span className="absolute inset-0" />
          {title}
        </Link>
      </h3>
      <p className="mt-5 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export const EventCard: FC<EventCardProps> = ({ event }) => {
  if (!event) {
    return (
      <article className="grid grid-cols-1 gap-4 w-full">
        <div className="h-48 bg-muted rounded-2xl animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-6 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        </div>
      </article>
    );
  }

  const { title, startDate, endDate, location, slug, description, image } =
    event;

  // Resolve the display occurrence (supports recurring events)
  let displayStart = startDate;
  let displayEnd = endDate;
  if ((event as any).occurrenceType === "recurring") {
    const next = computeNextOccurrence({
      _id: event._id as string,
      startDate: startDate,
      endDate: endDate ?? null,
      occurrenceType: (event as any).occurrenceType ?? null,
      recurrence: (event as any).recurrence ?? null,
    });
    if (next) {
      displayStart = next.startDate;
      displayEnd = next.endDate;
    }
  }

  return (
    <article className="grid grid-cols-1 gap-4 w-full">
      <div className="relative w-full h-auto aspect-[16/9] overflow-hidden rounded-2xl">
        <EventImage image={image} title={title} />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
      </div>
      <div className="w-full space-y-4">
        <EventMeta
          startDate={displayStart}
          endDate={displayEnd}
          location={location}
        />
        <EventContent title={title} slug={slug} description={description} />
      </div>
    </article>
  );
};

export const EventHeader: FC<{
  title: string | null;
  description: string | null;
}> = ({ title, description }) => {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="heading-2">{title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};
