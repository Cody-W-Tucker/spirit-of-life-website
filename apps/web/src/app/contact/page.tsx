import { PageBuilder } from "@/components/pagebuilder";
import { ContactForm } from "@/components/sections/contact-form";
import { sanityFetch } from "@/lib/sanity/live";
import { querySlugPageData } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";
import { Metadata } from "next";

async function fetchContactPageData() {
  // We try to fetch a page with slug "/contact"
  // If your CMS slugs don't start with /, try just "contact"
  return await sanityFetch(querySlugPageData, { slug: "/contact" });
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await fetchContactPageData();
  if (!pageData) {
    return getMetaData({
      title: "Contact Us",
      description: "Get in touch with us.",
    });
  }
  return getMetaData(pageData);
}

export default async function ContactPage(): Promise<React.ReactElement> {
  const pageData = await fetchContactPageData();

  if (pageData) {
    const { pageBuilder, _id, _type } = pageData;
    if (Array.isArray(pageBuilder) && pageBuilder.length > 0) {
      return <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />;
    }
  }

  // Fallback: Hardcoded Contact Form
  return (
    <main>
      <ContactForm
        _type="contactForm"
        _key="default-contact-form"
        title="Contact Us"
        subTitle={[
          {
            _type: "block",
            _key: "subtitle",
            style: "normal",
            markDefs: [],
            children: [
              {
                _type: "span",
                _key: "span1",
                text: "We'd love to hear from you. Please fill out the form below.",
                marks: [],
              },
            ],
          },
        ]}
      />
    </main>
  );
}
