import { Calendar } from "lucide-react";
import { defineField, defineType } from "sanity";

export const scheduleBar = defineType({
  name: "scheduleBar",
  title: "Schedule Bar",
  type: "object",
  icon: Calendar,
  fields: [
    defineField({
      name: "times",
      title: "Times",
      type: "array",
      description: "Add one or two schedule times (e.g., Sundays 10:00am)",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "Label for the event/time (e.g., 'Sundays')",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "time",
              title: "Time",
              type: "string",
              description: "Time for the event (e.g., '10:00am')",
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(2),
    }),
    defineField({
      name: "infoText",
      title: "Info Text",
      type: "string",
      description: "Additional info (e.g., 'All ages')",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "Location address (e.g., '3148 Dove Hill Ave')",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      times: "times",
      infoText: "infoText",
      location: "location",
    },
    prepare({ times = [], infoText, location }) {
      const timeParts = Array.isArray(times)
        ? times.map((t) => t && t.label && t.time ? `${t.label} ${t.time}` : null).filter(Boolean)
        : [];
      const parts = [...timeParts];
      if (infoText) parts.push(infoText);
      if (location) parts.push(location);
      return {
        title: `Schedule Bar`,
        subtitle: parts.join(' • '),
      };
    },
  },
}); 