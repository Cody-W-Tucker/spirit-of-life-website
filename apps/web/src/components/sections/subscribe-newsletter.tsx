"use client";
import { Button } from "@workspace/ui/components/button";
import { ChevronRight, LoaderCircle } from "lucide-react";
import type { FC } from "react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { newsletterSubmission } from "@/action/newsletter-submission";
import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";

const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

const unformatPhoneNumber = (value: string): string => {
  return value.replace(/\D/g, "");
};

// const InteractiveGridPattern = dynamic(
//   () =>
//     import("@workspace/ui/components/interactive-grid-pattern").then(
//       (mod) => mod.InteractiveGridPattern,
//     ),
//   {
//     ssr: false,
//   },
// );

type SubscribeNewsletterProps = PagebuilderType<"subscribeNewsletter">;

const SubscribeNewsletterButton: FC = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      size="icon"
      type="submit"
      disabled={pending}
      className="size-8 aspect-square bg-zinc-200 hover:bg-zinc-300"
      aria-label={pending ? "Subscribing..." : "Subscribe to newsletter"}
    >
      <span className="flex items-center justify-center gap-2">
        {pending ? (
          <LoaderCircle
            className="animate-spin text-black"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        ) : (
          <ChevronRight
            className="text-black"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        )}
      </span>
    </Button>
  );
};

export const SubscribeNewsletter: FC<SubscribeNewsletterProps> = ({
  title,
  subTitle,
  helperText,
}) => {
  const [phoneValue, setPhoneValue] = useState("");

  const [state, formAction] = useActionState(
    async (
      prevState: { success: boolean; message: string },
      formData: FormData,
    ) => {
      const phone = formData.get("phone") as string;
      formData.set("phone", unformatPhoneNumber(phone));
      return await newsletterSubmission(formData);
    },
    { success: false, message: "" },
  );

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneValue(formatted);
  };

  return (
    <section id="subscribe" className="px-4 py-8 sm:py-12 md:py-16">
      <div className="relative container mx-auto px-4 md:px-8 py-8 sm:py-16 md:py-24 lg:py-32 bg-gray-50 rounded-3xl overflow-hidden">
        <div className="relative z-10 mx-auto text-center">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-3xl md:text-5xl text-balance">
            {title}
          </h2>
          {subTitle && (
            <RichText
              richText={subTitle}
              className="mb-6 text-sm text-gray-600 sm:mb-8 text-balance sm:text-base"
            />
          )}
          <form
            className="flex flex-col items-center justify-center gap-3 w-full max-w-lg mx-auto"
            action={formAction}
          >
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <input
                type="text"
                name="firstName"
                required
                placeholder="First name"
                className="w-full bg-white border rounded-xl p-3 drop-shadow-lg focus-visible:ring-0 outline-none"
              />
              <input
                type="text"
                name="lastName"
                required
                placeholder="Last name"
                className="w-full bg-white border rounded-xl p-3 drop-shadow-lg focus-visible:ring-0 outline-none"
              />
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone number (optional)"
              value={phoneValue}
              onChange={handlePhoneChange}
              maxLength={14}
              className="w-full bg-white border rounded-xl p-3 drop-shadow-lg focus-visible:ring-0 outline-none"
            />
            <div className="flex bg-white items-center border rounded-xl p-2 drop-shadow-lg justify-between pl-4 w-full">
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                className="rounded-e-none border-e-0 focus-visible:ring-0 outline-none bg-transparent w-full"
              />
              <SubscribeNewsletterButton />
            </div>
          </form>
          {state.message && (
            <p
              className={`mt-3 text-sm ${state.success ? "text-green-600" : "text-red-600"}`}
            >
              {state.message}
            </p>
          )}
          {helperText && (
            <RichText
              richText={helperText}
              className="mt-3 text-sm text-gray-800 opacity-80 sm:mt-4"
            />
          )}
        </div>
        {/* <InteractiveGridPattern
          className={cn(
            "absolute scale-125 inset-0 -z-0 w-full opacity-50",
            "[mask-image:radial-gradient(1000px_circle_at_center,transparent,white)]",
          )}
        /> */}
      </div>
    </section>
  );
};
