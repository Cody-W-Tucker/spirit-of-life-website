import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const authorSection = defineType({
  name: "authorSection",
  type: "object",
  title: "Author Section",
  icon: UserIcon,
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Eyebrow Text",
      description: "Optional small text above the title",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Section Title",
      description: "Main heading for the author section",
    }),
    defineField({
      name: "subtitle",
      type: "string",
      title: "Subtitle",
      description: "Optional subtitle below the main title",
    }),
    defineField({
      name: "authors",
      type: "array",
      title: "Authors",
      description: "Select people to display in this section",
      of: [
        {
          type: "reference",
          to: [{ type: "author" }],
        },
      ],
      validation: (Rule) =>
        Rule.min(1).max(6).error("Please select 1-6 authors"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      authors: "authors",
    },
    prepare: ({ title, authors }) => {
      const authorCount = authors?.length || 0;
      return {
        title: title || "Author Section",
        subtitle: `${authorCount} author${authorCount !== 1 ? "s" : ""} selected`,
      };
    },
  },
});
