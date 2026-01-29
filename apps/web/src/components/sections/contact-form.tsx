"use client";

import { Button } from "@workspace/ui/components/button";
import { LoaderCircle, Send } from "lucide-react";
import type { FC } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { contactSubmission } from "@/action/contact-submission";
import type { SanityRichTextProps } from "@/types";

import { RichText } from "../richtext";

interface ContactFormProps {
  _type: "contactForm";
  _key: string;
  title?: string;
  subTitle?: SanityRichTextProps;
  helperText?: SanityRichTextProps;
}

const SubmitButton: FC = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto min-w-[150px]"
    >
      <span className="flex items-center justify-center gap-2">
        {pending ? (
          <>
            <LoaderCircle
              className="animate-spin"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            Sending...
          </>
        ) : (
          <>
            <Send size={16} strokeWidth={2} aria-hidden="true" />
            Send Message
          </>
        )}
      </span>
    </Button>
  );
};

export const ContactForm: FC<ContactFormProps> = ({
  title = "Contact Us",
  subTitle,
  helperText,
}) => {
  const [state, formAction] = useActionState(
    async (
      prevState: { success: boolean; message: string },
      formData: FormData,
    ) => {
      return await contactSubmission(formData);
    },
    { success: false, message: "" },
  );

  return (
    <section id="contact" className="px-4 py-8 sm:py-12 md:py-16">
      <div className="relative container mx-auto px-4 md:px-8 py-8 sm:py-16 md:py-24 lg:py-32 bg-gray-50 rounded-3xl overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-3xl md:text-5xl text-balance">
              {title}
            </h2>
            {subTitle && (
              <div className="mb-6 text-sm text-gray-600 sm:mb-8 text-balance sm:text-base">
                <RichText richText={subTitle} />
              </div>
            )}
          </div>

          <form className="flex flex-col gap-6" action={formAction}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Your Name"
                  className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="your.email@example.com"
                  className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="subject"
                className="text-sm font-medium text-gray-700"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                placeholder="How can we help?"
                className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Your message here..."
                className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            <div className="flex justify-center mt-4">
              <SubmitButton />
            </div>
          </form>

          {state.message && (
            <div
              className={`mt-4 text-center ${state.success ? "text-green-600" : "text-red-600"}`}
            >
              {state.message}
            </div>
          )}

          {helperText && (
            <div className="mt-8 text-center text-sm text-gray-500">
              <RichText richText={helperText} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
