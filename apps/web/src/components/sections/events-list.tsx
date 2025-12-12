import Link from "next/link";

import { SanityImage } from "@/components/sanity-image";
import { buildDisplayEvents } from "@/lib/recurrence";

import { RichText } from "../richtext";

type EventItem = {
  _id: string;
  title: string | null;
  description: string | null;
  image?: any;
  slug: string | null;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  occurrenceType?: "single" | "recurring" | null;
  recurrence?: any;
};

interface EventsListProps {
  _key?: string;
  _type?: string;
  title?: string | null;
  subTitle?: any[] | null;
  buttons?: any[] | null;
  events?: EventItem[];
  onlyUpcoming?: boolean;
  includeRecurring?: boolean;
  limit?: number;
  mode?: "auto" | "manual";
}

export function EventsListSection({
  title,
  subTitle,
  events = [],
  onlyUpcoming = true,
  includeRecurring = true,
  limit = 6,
  mode = "auto",
}: EventsListProps): React.JSX.Element {
  const displayEvents = buildDisplayEvents(events ?? [], {
    onlyUpcoming: mode === "manual" ? false : onlyUpcoming,
    includeRecurring,
    limit,
  });
  return (
    <section className="container mx-auto px-4 md:px-6">
      {(title || (Array.isArray(subTitle) && subTitle.length > 0)) && (
        <div className="max-w-4xl mb-8 md:mb-12">
          {title && <h2 className="heading-2 text-pretty">{title}</h2>}
          {Array.isArray(subTitle) && subTitle.length > 0 && (
            <RichText
              richText={subTitle}
              className="mt-4 text-lg leading-8 text-muted-foreground"
            />
          )}
        </div>
      )}

      {displayEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2">
          {displayEvents.map((event: any) => (
            <article key={event._id} className="grid grid-cols-1 gap-4 w-full">
              <div className="relative w-full h-auto aspect-[16/9] overflow-hidden rounded-2xl">
                {event.image?.asset && (
                  <SanityImage
                    asset={event.image}
                    alt={event.title ?? "Event image"}
                    width={800}
                    height={400}
                    className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                  />
                )}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="w-full space-y-4">
                <div className="flex items-center gap-x-4 text-xs my-4">
                  <time
                    dateTime={event.displayStartDate ?? event.startDate ?? ""}
                    className="text-muted-foreground"
                  >
                    {(event.displayStartDate ?? event.startDate)
                      ? new Date(
                          event.displayStartDate ?? event.startDate,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </time>
                  {(event.displayEndDate ?? event.endDate) && (
                    <time
                      dateTime={event.displayEndDate ?? event.endDate}
                      className="text-muted-foreground"
                    >
                      -{" "}
                      {new Date(
                        event.displayEndDate ?? event.endDate,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  )}
                  {event.location && (
                    <p className="text-muted-foreground">{event.location}</p>
                  )}
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6">
                    <Link
                      href={event.slug ? `/connect/event/${event.slug}` : "#"}
                    >
                      <span className="absolute inset-0" />
                      {event.title}
                    </Link>
                  </h3>
                  <p className="mt-5 text-sm leading-6 text-muted-foreground">
                    {event.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No events to show.</p>
      )}
    </section>
  );
}
