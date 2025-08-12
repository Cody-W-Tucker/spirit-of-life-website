import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug } from "../../utils/slug";
import { pageBuilderField } from "../common";

export const connectPage = defineType({
  name: "connectPage",
  type: "document",
  title: "Connect Page",
  icon: UsersIcon,
  description:
    "This is where you manage the Connect page content, including events and ways to get involved. You can add sections (like events list, CTAs, and more) using the page builder.",
  groups: GROUPS,
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "The main heading for your Connect page",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description:
        "A short summary describing how people can connect, join groups, and attend events.",
      rows: 3,
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "slug",
      type: "slug",
      description:
        "The web address for your Connect page (should be '/connect')",
      group: GROUP.MAIN_CONTENT,
      options: {
        source: "title",
        slugify: createSlug,
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
      title: title || "Connect Page",
      media: UsersIcon,
      subtitle: slug || "/connect",
    }),
  },
});
