import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { Calendar } from "lucide-react";
import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug, isUnique } from "../../utils/slug";

export const event = defineType({
  name: "event",
  type: "document",
  title: "Event",
  icon: Calendar,
  description: "An event happening at Spirit of Life.",
  groups: GROUPS,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "event" }),
    defineField({
      name: "title",
      type: "string",
      description: "The title of the event.",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "occurrenceType",
      title: "Event Type",
      type: "string",
      description: "Is this a one-time event or a recurring event?",
      group: GROUP.MAIN_CONTENT,
      initialValue: "single",
      options: {
        layout: "radio",
        list: [
          { title: "One-time", value: "single" },
          { title: "Recurring", value: "recurring" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      description: "The web address for this event page.",
      group: GROUP.MAIN_CONTENT,
      options: {
        source: "title",
        slugify: createSlug,
        isUnique: isUnique,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      description: "An image for the event.",
      group: GROUP.MAIN_CONTENT,
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "description",
      type: "text",
      description: "A description of the event.",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "datetime",
      description: "The start date and time of the event.",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
      description: "The end date and time of the event.",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "recurrence",
      title: "Recurrence",
      type: "object",
      group: GROUP.MAIN_CONTENT,
      description: "Define how this event repeats over time.",
      hidden: ({ parent }) => parent?.occurrenceType !== "recurring",
      fields: [
        defineField({
          name: "frequency",
          title: "Frequency",
          type: "string",
          initialValue: "weekly",
          options: {
            layout: "radio",
            list: [
              { title: "Daily", value: "daily" },
              { title: "Weekly", value: "weekly" },
              { title: "Monthly", value: "monthly" },
            ],
          },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "interval",
          title: "Repeat every",
          type: "number",
          description: "Repeat every N frequency units (e.g., every 2 weeks)",
          initialValue: 1,
          validation: (Rule) => Rule.min(1).max(52),
        }),
        defineField({
          name: "byWeekday",
          title: "Days of week",
          type: "array",
          of: [
            defineField({
              name: "weekday",
              type: "string",
              options: {
                list: [
                  { title: "Sunday", value: "sun" },
                  { title: "Monday", value: "mon" },
                  { title: "Tuesday", value: "tue" },
                  { title: "Wednesday", value: "wed" },
                  { title: "Thursday", value: "thu" },
                  { title: "Friday", value: "fri" },
                  { title: "Saturday", value: "sat" },
                ],
              },
            }),
          ],
          hidden: ({ parent }) => parent?.frequency !== "weekly",
        }),
        defineField({
          name: "byMonthday",
          title: "Days of month",
          type: "array",
          of: [{ type: "number" }],
          description:
            "For monthly frequency, choose which day(s) of the month (1-31)",
          hidden: ({ parent }) =>
            parent?.frequency !== "monthly" ||
            parent?.monthlyMode === "byWeekdayOfMonth",
          validation: (Rule) => Rule.unique(),
        }),
        defineField({
          name: "monthlyMode",
          title: "Monthly pattern",
          type: "string",
          initialValue: "byDate",
          options: {
            layout: "radio",
            list: [
              {
                title: "On specific day(s) of month (e.g., 5th)",
                value: "byDate",
              },
              {
                title: "On weekday position (e.g., 1st Sunday)",
                value: "byWeekdayOfMonth",
              },
            ],
          },
          hidden: ({ parent }) => parent?.frequency !== "monthly",
        }),
        defineField({
          name: "weekOfMonth",
          title: "Week of month",
          type: "number",
          description:
            "1 = first, 2 = second, 3 = third, 4 = fourth, 5 = fifth (if exists)",
          validation: (Rule) => Rule.min(1).max(5),
          hidden: ({ parent }) =>
            parent?.frequency !== "monthly" ||
            parent?.monthlyMode !== "byWeekdayOfMonth",
        }),
        defineField({
          name: "weekday",
          title: "Weekday",
          type: "string",
          options: {
            list: [
              { title: "Sunday", value: "sun" },
              { title: "Monday", value: "mon" },
              { title: "Tuesday", value: "tue" },
              { title: "Wednesday", value: "wed" },
              { title: "Thursday", value: "thu" },
              { title: "Friday", value: "fri" },
              { title: "Saturday", value: "sat" },
            ],
          },
          hidden: ({ parent }) =>
            parent?.frequency !== "monthly" ||
            parent?.monthlyMode !== "byWeekdayOfMonth",
        }),
        defineField({
          name: "until",
          title: "Repeat until",
          type: "datetime",
          description: "Optional end date for the recurrence",
        }),
        defineField({
          name: "count",
          title: "Number of occurrences",
          type: "number",
          description: "Stop after this many occurrences (optional)",
          validation: (Rule) => Rule.min(1).max(1000),
        }),
        defineField({
          name: "exceptions",
          title: "Skip dates",
          type: "array",
          of: [{ type: "datetime" }],
          description: "Dates to skip (holidays, cancellations)",
        }),
      ],
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description:
        'The location of the event. Can be a physical address or "Online".',
      group: GROUP.MAIN_CONTENT,
    }),
    ...seoFields,
    ...ogFields,
  ],
  preview: {
    select: {
      title: "title",
      startDate: "startDate",
      image: "image",
    },
    prepare({ title, startDate, image }) {
      return {
        title: title || "Untitled Event",
        subtitle: startDate ? new Date(startDate).toLocaleString() : "No date",
        media: image,
      };
    },
  },
});
