import FeaturedSermon from "@/components/featured-sermon";
import { PageBuilder } from "@/components/pagebuilder";
import SermonArchive from "@/components/sermon-archive";
import { sanityFetch } from "@/lib/sanity/live";
import { queryHomePageData } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";
import { getLatestYouTubeVideos } from "@/lib/youtube";

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

  // Fetch YouTube videos - client-side safeguard to limit to 7 max
  const latestYouTubeVideosRaw = await getLatestYouTubeVideos(7);
  const latestYouTubeVideos = latestYouTubeVideosRaw.slice(0, 7);
  const latestVideo = latestYouTubeVideos[0] ?? null;

  if (!homePageData) {
    return <div>No home page data</div>;
  }

  const { _id, _type, pageBuilder } = homePageData;

  return (
    <>
      <PageBuilder pageBuilder={pageBuilder ?? []} id={_id} type={_type} />

      {/* YouTube Sermon Sections */}
      {latestVideo && <FeaturedSermon video={latestVideo} />}
      {latestYouTubeVideos.length > 1 && (
        <SermonArchive skipFirst videos={latestYouTubeVideos} />
      )}
    </>
  );
}
