# Leads (booking requests)

The lead form ([components/LeadForm.tsx](../components/LeadForm.tsx)) posts to
[app/api/lead/route.ts](../app/api/lead/route.ts), which appends one row per
request to a Google Sheet. Allowed option values and the date rule live in
[lib/lead-options.ts](../lib/lead-options.ts) and are shared by the form and the API.

## Sheet columns (A–S)

Columns A–I keep their original positions, so existing rows and formulas keep
working. **Update the sheet's header row** to these labels:

| Col | Header | Content |
|---|---|---|
| A | timestamp | Submission time (ISO 8601, UTC) |
| B | condition | อาการหรือภาวะ (required) |
| C | province | จังหวัด, or "จังหวัดอื่น" (required) |
| D | district | เขต / อำเภอ (required) |
| E | name | ชื่อผู้ติดต่อ (required) |
| F | tel | เบอร์โทรศัพท์ (required) |
| G | firstSessionTime | ช่วงเวลาฝึกครั้งแรก (required). *Previously: preferred doctor-consult time.* |
| H | note | เล่าอาการเพิ่มเติม (optional). *Previously: symptoms.* |
| I | onset | เป็นมานานเท่าไร (optional option). *Previously: free-text duration.* |
| J | mobility | การเคลื่อนไหวของคนไข้ (optional) |
| K | firstSessionDate | วันที่ต้องการฝึกครั้งแรก, YYYY-MM-DD (required, ≥ today + 2 days, Asia/Bangkok) |
| L | contactPref | สะดวกให้ติดต่อกลับทาง: โทรศัพท์ / LINE (optional) |
| M | pagePath | Page the form was sent from |
| N | referrer | `document.referrer` |
| O | utm_source | From the page URL |
| P | utm_medium | From the page URL |
| Q | utm_campaign | From the page URL |
| R | gclid | Google Ads click ID |
| S | fbclid | Facebook click ID |

Rows written before this change have the old meaning in G, H and I.

## Range env var

The API appends to `Leads!A:S` by default. **If `GOOGLE_SHEET_RANGE` is set in
the hosting environment (e.g. `Leads!A:I`), update it to cover `A:S`**, or the
new columns may be dropped.

## Spam and privacy

- A hidden honeypot field (`company`) is included; if a bot fills it, the API
  answers `{ ok: true }` but writes nothing.
- The only analytics event is `generate_lead` with `lead_page` (the page path).
  No form contents (condition, mobility, province, name, phone, …) ever go to
  analytics. Source fields (M–S) go to the sheet only.
