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
        "The job title or role of this person, like 'Editor' or 'Writer'",
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      description:
        "A photo of the Person that will appear next to their articles",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "bio",
      type: "text",
      title: "Bio",
      description:
        "A short paragraph about the Person's background and expertise",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: "name",
      position: "position",
      media: "image",
      bio: "bio",
    },
    prepare: ({ title, position, media, bio }) => {
      // Create a playful subtitle with emojis
      const positionInfo = position ? `💼 ${position}` : "🎭 Mystery Writer";
      const bioPreview = bio
        ? `📝 ${bio.substring(0, 20)}${bio.length > 20 ? "..." : ""}`
        : "📝 No bio yet";

      return {
        title: `✍️ ${title || "Unnamed Person"}`,
        subtitle: `${positionInfo} | ${bioPreview}`,
        media,
      };
    },
  },
});
