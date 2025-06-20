import { cn } from "@workspace/ui/lib/utils";
import { ChevronDown, Circle } from "lucide-react";
import Link from "next/link";
import type { PortableTextBlock } from "next-sanity";
import { type FC, useMemo } from "react";
import slugify from "slugify";

export type TableProps = {
  richText?: PortableTextBlock[] | null;
};

interface HeadingData {
  heading: string;
  href: string;
  head: number;
  text: string;
  children: HeadingData[];
  isChild?: boolean;
  _key?: string;
}

interface HeadingBlock extends PortableTextBlock {
  style: keyof typeof headings;
}

const headings = {
  h2: "pl-0",
  h3: "pl-4",
  h4: "pl-8",
  h5: "pl-12",
  h6: "pl-16",
};

const extractTextFromBlock = (block: PortableTextBlock['children']): string => {
  return (block as Array<{ text?: string }>)?.[0]?.text || '';
};

const styleToNumber = (style: string): number => Number(style.replace("h", ""));

const isExistTableOfContent = (richText?: PortableTextBlock[]): HeadingBlock[] => {
  if (Array.isArray(richText)) {
    const even = (text: PortableTextBlock): text is HeadingBlock => 
      text.style !== undefined && text.style in headings;
    return richText.filter(even);
  }
  return [];
};

const getHeadingLevels = (exist: HeadingBlock[]): HeadingData[] => {
  const temp: HeadingData[] = exist.map((block) => {
    const text = extractTextFromBlock(block.children);
    return {
      heading: block.style,
      href: `#${slugify(text, {
        lower: true,
        strict: true,
      })}`,
      head: styleToNumber(block.style),
      text,
      children: [],
      _key: block._key,
    };
  });

  const headings: HeadingData[] = [];
  temp.forEach((block, index) => {
    const children: HeadingData[] = [];

    if (block.isChild) return;

    let count = index + 1;
    while (count < temp.length) {
      const currentItem = temp[count];
      if (!currentItem || block.head >= currentItem.head) break;
      
      children.push(currentItem);
      currentItem.isChild = true;
      count++;
    }

    headings.push({
      ...block,
      children,
    });
  });

  return headings;
};

const AnchorT: FC<{ heading: HeadingData }> = ({ heading }) => {
  const { href, text, children, isChild, heading: style } = heading;
  if (isChild === true && children?.length === 0) return <></>;

  return (
    <li
      className={cn("list-inside my-4", [
        headings[style as keyof typeof headings],
        isChild ? "ml-1.5" : "",
      ])}
    >
      <span className="flex items-center gap-2">
        <Circle
          className={cn(
            "min-w-1.5 min-h-1.5 size-1.5 ",
            !isChild && "fill-zinc-900",
          )}
          aria-hidden
        />
        <Link
          href={href}
          className=" hover:text-blue-500 hover:underline line-clamp-1"
        >
          {text}
        </Link>
      </span>

      {Array.isArray(children) && children.length > 0 && (
        <ul>
          {children.map((child, index) => (
            <AnchorT heading={child} key={`${child._key || child.text}-${index}-${style}`} />
          ))}
        </ul>
      )}
    </li>
  );
};

export const TableOfContent: FC<TableProps> = ({ richText }) => {
  const { showTableOfContent, headings } = useMemo(() => {
    const exist = isExistTableOfContent(richText ?? []);
    if (exist.length) {
      const headings = getHeadingLevels(exist);
      return {
        showTableOfContent: true,
        headings,
      };
    }
    return { showTableOfContent: !!exist.length };
  }, [richText]);

  if (!showTableOfContent) return <></>;

  return (
    <div className="sticky top-8 flex flex-col w-full max-w-xs p-4 bg-gradient-to-b from-zinc-50 to-zinc-100 shadow-sm rounded-lg border border-zinc-300">
      <details className="group">
        <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-zinc-800">
          <span>Table of Contents</span>
          <ChevronDown
            className="h-5 w-5 transform transition-transform duration-200 group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <nav className="mt-4 ml-3" aria-label="Table of contents">
          <ul className="text-sm">
            {Array.isArray(headings) &&
              headings.map((heading, index) => (
                <AnchorT heading={heading} key={`${heading._key || heading.text}-${index}`} />
              ))}
          </ul>
        </nav>
      </details>
    </div>
  );
};
