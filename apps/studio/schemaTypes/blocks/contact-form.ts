import { Send } from "lucide-react";
import { defineField, defineType } from "sanity";

import { customRichText } from "../definitions/rich-text";

export const contactForm = defineType({
  name: "contactForm",
  title: "Contact Form",
  type: "object",
  icon: Send,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Contact Us",
    }),
    customRichText(["block"], {
      name: "subTitle",
      title: "SubTitle",
    }),
    customRichText(["block"], {
      name: "helperText",
      title: "Helper Text",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title ?? "Contact Form",
      subtitle: "Contact Form",
    }),
  },
});
