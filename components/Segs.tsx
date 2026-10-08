import Link from "next/link";
import type { ReactNode } from "react";

import { fillTokens, PROGRAMME_NAMES, type Seg } from "@/lib/content-blocks";

// Unresolved draft blanks ("[วันที่]", "[ระบุ…]") render as yellow placeholders.
export function withPlaceholders(text: string): ReactNode {
  if (!text.includes("[")) return text;
  return text.split(/(\[[^\]]+\])/).map((part, i) =>
    part.startsWith("[") && part.endsWith("]") ? (
      <mark key={i} className="todo-placeholder">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

function SegLink({ href, children }: { href: string; children: ReactNode }) {
  const url = fillTokens(href);
  return url.startsWith("/") ? (
    <Link href={url}>{children}</Link>
  ) : (
    <a href={url}>{children}</a>
  );
}

export function Segs({ segs }: { segs: Seg[] }) {
  return (
    <>
      {segs.map((s, i) => {
        if (typeof s === "string") return <span key={i}>{withPlaceholders(fillTokens(s))}</span>;
        if ("programmes" in s) {
          // Programme names from lib/programmes.ts, each linked to homepage §5.
          return (
            <span key={i}>
              {PROGRAMME_NAMES.map((name, j) => (
                <span key={name}>
                  {j ? " · " : null}
                  <Link href="/#programmes">{name}</Link>
                </span>
              ))}
            </span>
          );
        }
        return (
          <SegLink key={i} href={s.href}>
            {fillTokens(s.text)}
          </SegLink>
        );
      })}
    </>
  );
}
