import { notFound } from "next/navigation";

import { SanityImage } from "@/components/sanity-image";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import { queryEventPaths, queryEventSlugPageData } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";

async function fetchEventSlugPageData(slug: string) {
  return await sanityFetch({
    query: queryEventSlugPageData,
    params: { slug: `/${slug}` },
  });
}

async function fetchEventPaths() {
  const slugs = await client.fetch(queryEventPaths);
  const paths: { slug: string }[] = [];
  for (const slug of slugs) {
    if (!slug) continue;
    const cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug;
    if (cleanSlug) paths.push({ slug: cleanSlug });
  }
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await fetchEventSlugPageData(slug);
  return await getMetaData(data ?? {});
}

export async function generateStaticParams() {
  return await fetchEventPaths();
}

export default async function EventSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;
  const { data } = await fetchEventSlugPageData(slug);
  if (!data) return notFound();
  const { title, description, image, startDate, endDate, location } = data ?? {};

  return (
    <div className="container my-16 mx-auto px-4 md:px-6">
      <main>
        <header className="mb-8">
          <h1 className="mt-2 text-4xl font-bold">{title}</h1>
          <div className="flex items-center gap-x-4 text-xs my-4">
            <time dateTime={startDate ?? ""} className="text-muted-foreground">
              {startDate
                ? new Date(startDate).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })
                : ""}
            </time>
            {endDate && (
              <time dateTime={endDate} className="text-muted-foreground">
                -{" "}
                {new Date(endDate).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </time>
            )}
            {location && <p className="text-muted-foreground">{location}</p>}
          </div>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        </header>
        {image && (
          <div className="mb-12">
            <SanityImage
              asset={image}
              alt={title}
              width={1600}
              loading="eager"
              priority
              height={900}
              className="rounded-lg h-auto w-full"
            />
          </div>
        )}
      </main>
    </div>
  );
}
