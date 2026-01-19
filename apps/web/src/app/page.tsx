import { PageBuilder } from "@/components/pagebuilder";
import { sanityFetch } from "@/lib/sanity/live";
import { queryHomePageData } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";

async function fetchHomePageData() {
  const { data } = await sanityFetch({ query: queryHomePageData });
  return data;
}

export async function generateMetadata() {
  const homePageData = await fetchHomePageData();
  return await getMetaData(homePageData ?? {});
}

export default async function Page(): Promise<React.ReactElement> {
  const homePageData = await fetchHomePageData();

  if (!homePageData) {
    return <div>No home page data</div>;
  }

  const { _id, _type, pageBuilder } = homePageData;

  return <PageBuilder pageBuilder={pageBuilder ?? []} id={_id} type={_type} />;
}
