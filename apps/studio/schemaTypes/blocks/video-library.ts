import { VideoIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const videoLibrary = defineType({
  name: "videoLibrary",
  type: "object",
  icon: VideoIcon,
  title: "Video Library",
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      description: "Main title for the video library section",
    }),
    defineField({
      name: "subtitle",
      title: "Section Subtitle",
      type: "string",
      description: "Optional subtitle or description for the video library",
    }),
    defineField({
      name: "videos",
      title: "Videos",
      type: "array",
      of: [
        {
          type: "object",
          name: "video",
          title: "Video",
          fields: [
            defineField({
              name: "title",
              title: "Video Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Video Description",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "videoUrl",
              title: "Video URL",
              type: "url",
              description: "YouTube, Vimeo, or direct video file URL",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "thumbnail",
              title: "Video Thumbnail",
              type: "image",
              description: "Custom thumbnail image (optional - will use video provider thumbnail if not provided)",
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: "duration",
              title: "Video Duration",
              type: "string",
              description: "Video duration (e.g., '5:30', '1:23:45')",
            }),
          ],
          preview: {
            select: {
              title: "title",
              description: "description",
              media: "thumbnail",
            },
            prepare: ({ title, description, media }) => ({
              title: title || "Untitled Video",
              subtitle: description || "No description",
              media,
            }),
          },
        },
      ],
      validation: (Rule) => Rule.max(3).min(1),
      description: "Add up to 3 videos to the library",
    }),
  ],
  preview: {
    select: {
      title: "title",
      videoCount: "videos.length",
    },
    prepare: ({ title, videoCount }) => ({
      title: title || "Video Library",
      subtitle: `${videoCount || 0} video${videoCount !== 1 ? 's' : ''}`,
    }),
  },
}); 