import { notFound } from "next/navigation";

import { EventCard, EventHeader } from "@/components/event-card";
import { PageBuilder } from "@/components/pagebuilder";
import { sanityFetch } from "@/lib/sanity/live";
import { queryEventIndexPageData } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";
import { handleErrors } from "@/utils";

async function fetchEvents() {
  return await handleErrors(sanityFetch({ query: queryEventIndexPageData }));
}

export async function generateMetadata() {
  const result = await sanityFetch({ query: queryEventIndexPageData });
  return await getMetaData(result?.data ?? {});
}

export default async function EventIndexPage(): Promise<React.JSX.Element> {
  const [res, err] = await fetchEvents();
  if (err || !res?.data) notFound();

  const {
    events = [],
    title,
    description,
    pageBuilder = [],
    _id,
    _type,
  } = res.data;

  if (!events.length) {
    return (
      <main className="container my-16 mx-auto px-4 md:px-6">
        <EventHeader title={title} description={description} />
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No events available at the moment.
          </p>
        </div>
        {pageBuilder && pageBuilder.length > 0 && (
          <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
        )}
      </main>
    );
  }

  return (
    <main className="bg-background">
      <div className="container my-16 mx-auto px-4 md:px-6">
        <EventHeader title={title} description={description} />

        {events.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2 mt-8">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>

      {pageBuilder && pageBuilder.length > 0 && (
        <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
      )}
    </main>
  );
}
