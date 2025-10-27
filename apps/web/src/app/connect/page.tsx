import { notFound } from "next/navigation";

import { PageBuilder } from "@/components/pagebuilder";
import { sanityFetch } from "@/lib/sanity/live";
import { queryConnectPageData } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";

async function fetchConnectPage() {
    return await sanityFetch(queryConnectPageData);
}

export async function generateMetadata() {
    const result = await sanityFetch(queryConnectPageData);
    return await getMetaData(result ?? {});
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