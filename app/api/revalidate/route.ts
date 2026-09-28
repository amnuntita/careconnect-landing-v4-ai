import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { revalidateSecret } from "@/sanity/env";

// Sanity publish webhook. Configure in the Sanity dashboard
// (API → Webhooks) to POST here on create/update/delete with the
// secret set to SANITY_REVALIDATE_SECRET. Recommended GROQ projection:
//   { "_type": _type, "slug": slug.current }
type WebhookPayload = {
  _type?: string;
  slug?: string | { current?: string };
};

export async function POST(req: NextRequest) {
  if (!revalidateSecret) {
    return new Response("Missing SANITY_REVALIDATE_SECRET", { status: 500 });
  }

  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      revalidateSecret,
    );

    if (!isValidSignature) {
      return new Response("Invalid signature", { status: 401 });
    }
    if (!body?._type) {
      return new Response("Bad request: missing _type", { status: 400 });
    }

    // Invalidate the document-type tag (e.g. "post", "settings").
    // Second arg is the stale-while-revalidate window ('max' = longest).
    revalidateTag(body._type, "max");

    // And the per-slug tag so the specific article refreshes immediately.
    const slug =
      typeof body.slug === "string" ? body.slug : body.slug?.current;
    if (body._type === "post" && slug) {
      revalidateTag(`post:${slug}`, "max");
    }

    return NextResponse.json({ revalidated: true, type: body._type, slug });
  } catch (err) {
    console.error("Revalidate webhook error:", err);
    return new Response("Error revalidating", { status: 500 });
  }
}
