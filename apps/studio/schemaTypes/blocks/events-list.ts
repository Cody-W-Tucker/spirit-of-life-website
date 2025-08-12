import { Calendar } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

export const eventsList = defineType({
  name: "eventsList",
  title: "Events List",
  type: "object",
  icon: Calendar,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Headline",
      description: "Title shown above the events grid",
    }),
    defineField({
      name: "subTitle",
      type: "array",
      title: "Sub Title",
      of: [defineArrayMember({ type: "block" })],
      description: "Optional supporting text below the headline",
    }),
    defineField({
      name: "mode",
      type: "string",
      title: "Source Mode",
      initialValue: "auto",
      options: {
        layout: "radio",
        list: [
          { title: "Automatic (by date)", value: "auto" },
          { title: "Manual selection", value: "manual" },
        ],
      },
      description:
        "Choose automatic listing by date or manually pick specific events",
    }),
    defineField({
      name: "selectedEvents",
      type: "array",
      title: "Selected Events",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "event" }],
        }),
      ],
      hidden: ({ parent }) => parent?.mode !== "manual",
    }),
    defineField({
      name: "onlyUpcoming",
      type: "boolean",
      title: "Only show upcoming events",
      initialValue: true,
      hidden: ({ parent }) => parent?.mode !== "auto",
    }),
    defineField({
      name: "limit",
      type: "number",
      title: "Max events to show",
      initialValue: 6,
      validation: (Rule) => Rule.min(1).max(24),
      hidden: ({ parent }) => parent?.mode !== "auto",
    }),
    defineField({
      name: "buttons",
      title: "Buttons",
      type: "array",
      of: [defineArrayMember({ type: "button" })],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title || "Events List",
        subtitle: "Page Builder Block",
      };
    },
  },
});
