import { PortableText, type PortableTextComponents } from "next-sanity";
import Image from "next/image";

import { urlFor } from "@/sanity/lib/image";
import type { SanityImage } from "@/sanity/lib/types";
import type { PortableTextBlock } from "next-sanity";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2 className="h2">{children}</h2>,
    h3: ({ children }) => <h3 className="h3">{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value: SanityImage & { caption?: string } }) => {
      if (!value?.asset) return null;
      return (
        <figure className="post-figure">
          <Image
            src={urlFor(value).width(1600).fit("max").auto("format").url()}
            alt={value.alt ?? ""}
            width={1600}
            height={900}
            sizes="(max-width: 768px) 100vw, 768px"
            className="post-figure-img"
          />
          {value.caption ? (
            <figcaption>{value.caption}</figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export function PortableTextBody({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="post-body">
      <PortableText value={value} components={components} />
    </div>
  );
}
