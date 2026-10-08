# Launch checklist — www.careconnectth.org

This checklist is for the person deploying the site. You don't need to change any code. Work through the sections in order and tick each box.

The new site goes live at **https://www.careconnectth.org**. The old site at **stroke.careconnectth.org** must forward to it, and must keep working so that old links keep forwarding.

---

## 1. Environment variables

Set these in the hosting dashboard (on Vercel: Project → Settings → Environment Variables) for the **Production** environment. After you add or change one, redeploy.

| Name | What it's for | Value |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | The site's address. Page links that Google sees, the sitemap, share previews and structured data are all built from it. The production build stops with an error if it's missing. | `https://www.careconnectth.org` (no slash at the end) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Which Sanity project the blog articles come from. | Keep the value already set on the current site (it's also shown in the Sanity dashboard). |
| `NEXT_PUBLIC_SANITY_DATASET` | Which Sanity dataset to read. | Keep the value already set on the current site. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version. Optional. | Leave unset (the site uses `2024-10-01`), or keep the current value. |
| `SANITY_REVALIDATE_SECRET` | Password shared with the Sanity webhook, so a newly published article shows up on the site within seconds. | Keep the current value. It must match the secret in Sanity → API → Webhooks. |
| `GOOGLE_SHEET_ID` | The Google Sheet where booking requests are saved. | Keep the current value. |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | The Google account the site uses to write to that Sheet. | Keep the current value. |
| `GOOGLE_PRIVATE_KEY_B64` | That account's key (base64). Secret. | Keep the current value. |
| `GOOGLE_SHEET_RANGE` | Tab and columns the form writes to. The form now fills 19 columns (A–S). | `Leads!A:S` |
| `VERCEL_ENV` | Tells the site it is the production build. | Set automatically by Vercel. Nothing to do. |

**Google Tag Manager has nothing to set.** The container ID `GTM-PK9DP4KB` is written into the site code (`app/layout.tsx`), not read from an environment variable.

**Google Sheet:** before launch, make sure row 1 of the `Leads` tab has the headers for columns A–S listed in `docs/leads.md`.

---

## 2. Domains and redirects

- [ ] **www.careconnectth.org** is the main domain for the project.
- [ ] **careconnectth.org** (without www) forwards to `https://www.careconnectth.org`.
- [ ] **stroke.careconnectth.org** forwards to `https://www.careconnectth.org`:
  - Use a **permanent** redirect (301 or 308), so Google moves the old site's ranking to the new one.
  - Keep the path. For example, `stroke.careconnectth.org/blog/abc` → `www.careconnectth.org/blog/abc`.
  - **Keep the subdomain alive** (don't delete the DNS record) for at least 12 months, so old links and bookmarks keep forwarding.
  - On Vercel: add `stroke.careconnectth.org` to the project under Settings → Domains, then choose "Redirect to" `www.careconnectth.org` with 308 (Permanent).

**Redirects already built into the site.** These need no setup; they're in `lib/redirects.ts` and `proxy.ts` and use a permanent 308:

| Old path | Goes to |
|---|---|
| `/home` | `/` |
| `/coming-soon-03` | `/` |
| `/เสียงจากผู้ใช้จริง` | `/` |
| `/service-page/psychiatry-consultation` | `/` |
| `/service-page/psychology-consultation` | `/` |
| `/blog/golden-period` | `/blog/stroke-after-discharge-guide` |
| any other `/post/...` (old Wix blog) | `/blog` |
| any other `/service-page/...` | `/` |

Old Wix blog posts with traffic should each get their own line in `lib/redirects.ts`, mapping old post to new post. That's a code change, so ask the developer.

---

## 3. Right after deploying

Check each item on a phone and on a computer.

- [ ] **Homepage loads** at https://www.careconnectth.org with images, menu and footer.
- [ ] **Booking form saves a row.** Fill in the form at the bottom of the homepage with test details (write "TEST" in the name) and send it. Check that:
  - the success screen appears;
  - a new row appears in the Google Sheet with the test details in columns A–S;
  - you then delete the test row.
- [ ] **Sitemap uses www.** Open https://www.careconnectth.org/sitemap.xml. Every address in it starts with `https://www.careconnectth.org/`. It includes `/privacy` and `/terms`.
- [ ] **robots.txt uses www.** Open https://www.careconnectth.org/robots.txt. It says `Allow: /` and its `Sitemap:` line is `https://www.careconnectth.org/sitemap.xml`.
- [ ] **Old site forwards.** Open https://stroke.careconnectth.org and check that it lands on https://www.careconnectth.org.
- [ ] **Share preview shows the picture.** Paste https://www.careconnectth.org into a LINE chat (or the Facebook Sharing Debugger at https://developers.facebook.com/tools/debug/). It should show the CareConnect title, description and image. Try one article link too.
- [ ] **Pages open.** Click through the menu: บริการ (each service), ค่าบริการ, พื้นที่ให้บริการ, บทความ, เกี่ยวกับเรา, plus เงื่อนไขการใช้บริการ and นโยบายความเป็นส่วนตัว in the footer.

---

## 4. Google Search Console

Do this on launch day, after the checks above pass.

1. **Add the new site.** In https://search.google.com/search-console, click "Add property" → **Domain** → `careconnectth.org`, and verify with the DNS record Google gives you. If a Domain property already exists, use it.
2. **Submit the sitemap.** In the property, open **Sitemaps** and submit `https://www.careconnectth.org/sitemap.xml`. Status should become "Success" within a day or two.
3. **Tell Google the address changed.**
   - Open the **old** property for `stroke.careconnectth.org`. Add it as a URL-prefix property `https://stroke.careconnectth.org/` if it isn't there.
   - Go to Settings → **Change of address**, and choose the new site `https://www.careconnectth.org`.
   - Google checks that the old address forwards (section 2), so set up the redirect first.
4. **Check the homepage.** Use **URL Inspection** on `https://www.careconnectth.org/` and click "Request indexing".
5. Over the following weeks, watch **Pages** (indexing) and **Performance** in the new property. Rankings may move a little for a few weeks after a move; that's normal.
