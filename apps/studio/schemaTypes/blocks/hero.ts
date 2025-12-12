import { Star } from "lucide-react";
import { defineField, defineType } from "sanity";

import { buttonsField, richTextField } from "../common";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  icon: Star,
  type: "object",
  fields: [
    defineField({
      name: "badge",
      type: "string",
      title: "Badge",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    richTextField,
    defineField({
      name: "images",
      type: "array",
      title: "Images",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (Rule) => Rule.max(5).error("Maximum 5 images allowed"),
    }),
    defineField({
      name: "layout",
      type: "string",
      title: "Layout",
      options: {
        list: [
          { title: "Content Left, Image Right", value: "left" },
          { title: "Content Right, Image Left", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "left",
    }),
    buttonsField,
  ],
  preview: {
    select: {
      title: "title",
      image: "images.0",
    },
    prepare: ({ title, image }) => ({
      title,
      subtitle: "Hero Block",
      media: image,
    }),
  },
});
