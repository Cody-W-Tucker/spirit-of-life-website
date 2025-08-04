import { FileText } from "lucide-react";
import { defineField } from "sanity";
import { defineType } from "sanity";

import { richTextField } from "../common";

export const contentSection = defineType({
  name: "contentSection",
  type: "object",
  icon: FileText,
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Eyebrow Text",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Main Title",
    }),
    {
      ...richTextField,
      title: "Content",
      description:
        "Main content - you can add headers, paragraphs, and other formatting as needed",
    },
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
      validation: (Rule) => Rule.max(4).error("Maximum 4 images allowed"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      eyebrow: "eyebrow",
    },
    prepare: ({ title, eyebrow }) => ({
      title: title || "Untitled Content Section",
      subtitle: eyebrow ? `${eyebrow} | Content Section` : "Content Section",
    }),
  },
});
