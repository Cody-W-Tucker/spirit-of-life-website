import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Person",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Name",
      description: "The full name of the person who wrote the content",
      validation: (Rule) => Rule.required().error("Person name is required"),
    }),
    defineField({
      name: "position",
      type: "string",
      title: "Position",
      description:
        "The job title or role of this person, like 'Pastor' or 'Director'",
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      description: "A photo of the Person",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "bio",
      type: "richText",
      title: "Bio",
      description:
        "A short paragraph about the Person's background and expertise with text, images, and formatting",
    }),
  ],
  preview: {
    select: {
      title: "name",
      position: "position",
      media: "image",
    },
    prepare: ({ title, position, media }) => {
      const positionInfo = position ? `${position}` : "";

      return {
        title: `${title || "Unnamed Person"}`,
        subtitle: `${positionInfo}`,
        media,
      };
    },
  },
});
