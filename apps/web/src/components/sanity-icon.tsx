import { cn } from "@workspace/ui/lib/utils";
import type { ComponentProps } from "react";
import { forwardRef, memo } from "react";

interface IconProps extends Omit<ComponentProps<"span">, "src"> {
  icon?:
    | {
        svg?: string | null;
        name?: string | null;
      }
    | string
    | null;
  alt?: string; // Add alt text prop for accessibility
}

export const SanityIcon = memo(
  forwardRef<HTMLSpanElement, IconProps>(function SanityIconUnmemorized(
    { icon, className, alt: altText = "sanity-icon", ...props },
    ref,
  ) {
    const alt = typeof icon === "object" && icon?.name ? icon?.name : altText;
    const svg = typeof icon === "object" ? icon?.svg : icon;

    if (!svg) {
      return null;
    }

    return (
      <span
        ref={ref}
        {...props}
        className={cn(
          "flex size-12 items-center justify-center sanity-icon",
          className,
        )}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: svg }}
        role="img"
        aria-label={alt}
        title={alt}
      />
    );
  }),
);
