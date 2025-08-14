import { Image as ImageIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

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
