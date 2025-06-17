import { defineField, defineType } from "sanity";
import { Image as ImageIcon } from "lucide-react";

export const fullpageImage = defineType({
  name: "fullpageImage",
  title: "Fullpage Image",
  icon: ImageIcon,
  type: "object",
  fields: [
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "overlayText",
      type: "string",
      title: "Overlay Text",
    }),
    defineField({
      name: "button",
      type: "button",
      title: "Call to Action Button",
    }),
  ],
  preview: {
    select: {
      title: "overlayText",
      media: "image",
    },
    prepare({ title, media }) {
      return {
        title: title || "Fullpage Image",
        media,
        subtitle: "Fullpage Image Block",
      };
    },
  },
}); 