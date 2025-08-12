import { notFound } from "next/navigation";

import { PageBuilder } from "@/components/pagebuilder";
import { sanityFetch } from "@/lib/sanity/live";
import { queryConnectPageData } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";

async function fetchConnectPage() {
    return await sanityFetch({
        query: queryConnectPageData,
    });
}

export async function generateMetadata() {
    const result = await sanityFetch({
        query: queryConnectPageData,
    });
    return await getMetaData(result?.data ?? {});
}

export default async function ConnectPage(): Promise<React.JSX.Element> {
    const res = await fetchConnectPage();
    const data = res?.data;
    if (!data) notFound();

    const { pageBuilder, _id, _type } = data;
    const blocks = Array.isArray(pageBuilder) ? pageBuilder : [];

    return (
        <main className="bg-background">
            <PageBuilder pageBuilder={blocks} id={_id} type={_type} />
        </main>
    );
} 