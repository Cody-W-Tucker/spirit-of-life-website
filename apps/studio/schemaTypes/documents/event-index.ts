import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug, isUnique } from "../../utils/slug";
import { pageBuilderField } from "../common";

export const eventIndex = defineType({
  name: "eventIndex",
  type: "document",
  title: "Event Listing Page",
  description:
    "This is the main page that shows all your events. You can customize how your event listing page looks, what title it has, and which event you want to highlight at the top.",
  groups: GROUPS,
  fields: [
    defineField({
      name: "title",
      type: "string",
      description:
        "The main heading that will appear at the top of your event listing page",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "description",
      type: "text",
      description:
        "A short summary of what visitors can find on your events page. This helps people understand what your events are about.",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "slug",
      type: "slug",
      description:
        "The web address for your events page (for example, '/events' would create a page at yourdomain.com/events)",
      group: GROUP.MAIN_CONTENT,
      options: {
        source: "title",
        slugify: createSlug,
        isUnique: isUnique,
      },
      validation: (Rule) => Rule.required(),
    }),
    pageBuilderField,
    ...seoFields.filter(
      (field) => !["seoNoIndex", "seoHideFromLists"].includes(field.name),
    ),
    ...ogFields,
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
      slug: "slug.current",
    },
    prepare: ({ title, description, slug }) => ({
      title: title || "Untitled Event Listing",
      subtitle: description || slug || "Event Listing",
    }),
  },
});