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
        name: 'image',
        type: 'image',
        title: 'Image',
        description: 'An image for the event.',
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
        name: 'startDate',
        title: 'Start Date',
        type: 'datetime',
        description: 'The start date and time of the event.',
        group: GROUP.MAIN_CONTENT,
        validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: 'endDate',
        title: 'End Date',
        type: 'datetime',
        description: 'The end date and time of the event.',
        group: GROUP.MAIN_CONTENT,
    }),
    defineField({
        name: 'location',
        title: 'Location',
        type: 'string',
        description: 'The location of the event. Can be a physical address or "Online".',
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