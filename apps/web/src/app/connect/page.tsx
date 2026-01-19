import { notFound } from "next/navigation";

import { PageBuilder } from "@/components/pagebuilder";
import { sanityFetch } from "@/lib/sanity/live";
import { queryConnectPageData } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";

async function fetchConnectPage() {
  const { data } = await sanityFetch({ query: queryConnectPageData });
  return data;
}

export async function generateMetadata() {
  const { data } = await sanityFetch({ query: queryConnectPageData });
  return await getMetaData(data ?? {});
}

export default async function ConnectPage(): Promise<React.JSX.Element> {
  const data = await fetchConnectPage();
  if (!data) notFound();

  const { pageBuilder, _id, _type } = data;
  const blocks = Array.isArray(pageBuilder) ? pageBuilder : [];

  return (
    <main className="bg-background">
      <PageBuilder pageBuilder={blocks} id={_id} type={_type} />
    </main>
  );
}
