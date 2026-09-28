# Images

Guidance for adding images to the landing page. All images use [`next/image`](https://nextjs.org/docs/app/api-reference/components/image), which gives us automatic format conversion (AVIF/WebP), responsive `srcset`, and lazy-loading.

## Where files live

Put image files under `public/images/`, organized by section:

```
public/images/
  hero/
  reviews/        ← customer review photos
    jane-doe.jpg
    john-smith.jpg
  features/
  gallery/
```

You reference them with an absolute path from `public/`, so `public/images/reviews/jane-doe.jpg` becomes `src="/images/reviews/jane-doe.jpg"`.

## Lazy-loading

`next/image` lazy-loads by default. You don't opt in — you opt _out_ with `priority`.

- **`priority`** — only on the hero / above-the-fold image (one, maybe two max). Tells the browser to preload.
- **No `priority`** — everything else (reviews, gallery, feature icons below the fold). Lazy-loads automatically when scrolled near the viewport.

Do **not** set `loading="lazy"` manually — it's already the default, and it would conflict with `priority`.

### Example: customer reviews (lazy-loaded)

```tsx
// components/Reviews.tsx
import Image from "next/image";

const reviews = [
  { name: "Jane Doe", quote: "...", avatar: "/images/reviews/jane-doe.jpg" },
  // ...
];

export function Reviews() {
  return (
    <section className="py-24">
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <li key={r.name}>
            <Image
              src={r.avatar}
              alt={`Photo of ${r.name}`}
              width={80}
              height={80}
              sizes="80px"
              className="rounded-full"
            />
            <blockquote>{r.quote}</blockquote>
            <p>{r.name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

## The `sizes` attribute

`sizes` matters even for lazy images — it's how the browser picks which variant of the `srcset` to download. Get this wrong and you'll either download oversized images (slow) or undersized ones (blurry).

- **Fixed-size images** (avatars, icons): use a CSS length — `sizes="80px"`
- **Fluid responsive images**: viewport-relative — `sizes="(max-width: 640px) 100vw, 33vw"` means "full viewport on mobile, one-third on larger screens"
- **Full-bleed images** (hero): `sizes="100vw"`

## Blur placeholders

For real photos (not SVGs), use `placeholder="blur"` to avoid a flash of empty space while the image loads.

- **Static imports** (recommended) — Next auto-generates the blur:
  ```tsx
  import jane from "@/public/images/reviews/jane-doe.jpg";
  <Image src={jane} alt="..." placeholder="blur" />
  ```
- **Dynamic string paths** — you must provide `blurDataURL` yourself (a small base64-encoded preview).

## Fine-tuning priority further down the page

If a below-the-fold image is heavy and you want the browser to deprioritize it even more (e.g. footer logos, low-importance gallery items), add `fetchPriority="low"`. Use sparingly — the default lazy behavior is usually enough.

## Checklist when adding a new image

- [ ] File placed under `public/images/<section>/`
- [ ] `<Image>` has `src`, `alt`, `width`, `height`
- [ ] `sizes` matches how the image is rendered
- [ ] `priority` only if above-the-fold
- [ ] `placeholder="blur"` if it's a photo (via static import)
- [ ] `alt` is descriptive — search engines and screen readers both read it
