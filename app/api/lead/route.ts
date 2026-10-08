import { google } from "googleapis";
import { NextResponse, type NextRequest } from "next/server";

import {
  CONDITION_OPTIONS,
  CONTACT_OPTIONS,
  isIsoDate,
  isValidThaiPhone,
  minFirstSessionDate,
  MOBILITY_OPTIONS,
  ONSET_OPTIONS,
  PROVINCE_OPTIONS,
  TIME_OPTIONS,
} from "@/lib/lead-options";

// Sheets API needs Node built-ins (crypto, etc.), so force the Node runtime.
export const runtime = "nodejs";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SA_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
// Base64-encoded service-account private key (avoids newline/quote mangling
// in host env UIs like Netlify). Decode to PEM at use.
const SA_KEY_B64 = process.env.GOOGLE_PRIVATE_KEY_B64;

// Tab + range to append into: 19 columns, A–S (see docs/leads.md).
// NOTE: if GOOGLE_SHEET_RANGE is set in production (e.g. "Leads!A:I"), it
// overrides this default and must be updated to cover A:S as well.
const SHEET_RANGE = process.env.GOOGLE_SHEET_RANGE ?? "Leads!A:S";

type LeadPayload = Partial<
  Record<
    | "condition"
    | "mobility"
    | "onset"
    | "province"
    | "district"
    | "firstSessionDate"
    | "firstSessionTime"
    | "name"
    | "tel"
    | "contactPref"
    | "note"
    | "pagePath"
    | "referrer"
    | "utm_source"
    | "utm_medium"
    | "utm_campaign"
    | "gclid"
    | "fbclid"
    | "company",
    unknown
  >
>;

// Strings only, trimmed and length-capped (the sheet is not a dumping ground).
function str(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function getSheetsClient() {
  const privateKey = Buffer.from(SA_KEY_B64!, "base64").toString("utf8");

  const auth = new google.auth.JWT({
    email: SA_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

const bad = (message: string) =>
  NextResponse.json({ error: message }, { status: 400 });

export async function POST(request: NextRequest) {
  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return bad("Invalid request body.");
  }
  if (!body || typeof body !== "object") return bad("Invalid request body.");

  // Honeypot filled: pretend success, write nothing.
  if (str(body.company)) {
    return NextResponse.json({ ok: true });
  }

  const lead = {
    condition: str(body.condition),
    mobility: str(body.mobility),
    onset: str(body.onset),
    province: str(body.province),
    district: str(body.district, 120),
    firstSessionDate: str(body.firstSessionDate, 10),
    firstSessionTime: str(body.firstSessionTime),
    name: str(body.name, 120),
    tel: str(body.tel, 30),
    contactPref: str(body.contactPref),
    note: str(body.note, 2000),
    pagePath: str(body.pagePath, 300),
    referrer: str(body.referrer, 1000),
    utm_source: str(body.utm_source, 200),
    utm_medium: str(body.utm_medium, 200),
    utm_campaign: str(body.utm_campaign, 200),
    gclid: str(body.gclid, 300),
    fbclid: str(body.fbclid, 300),
  };

  // Required (mirrors the form).
  for (const key of [
    "condition",
    "province",
    "district",
    "firstSessionDate",
    "firstSessionTime",
    "name",
    "tel",
  ] as const) {
    if (!lead[key]) return bad(`Missing required field: ${key}`);
  }

  // Option fields: one of the allowed values (or empty where optional).
  const oneOf = (value: string, options: readonly string[], optional: boolean) =>
    (optional && value === "") || options.includes(value);
  if (!oneOf(lead.condition, CONDITION_OPTIONS, false)) return bad("Invalid condition.");
  if (!oneOf(lead.mobility, MOBILITY_OPTIONS, true)) return bad("Invalid mobility.");
  if (!oneOf(lead.onset, ONSET_OPTIONS, true)) return bad("Invalid onset.");
  if (!oneOf(lead.province, PROVINCE_OPTIONS, false)) return bad("Invalid province.");
  if (!oneOf(lead.contactPref, CONTACT_OPTIONS, true)) return bad("Invalid contactPref.");
  if (!oneOf(lead.firstSessionTime, TIME_OPTIONS, false)) {
    return bad("Invalid firstSessionTime.");
  }

  // Date: YYYY-MM-DD, no earlier than today + 2 days in Asia/Bangkok.
  if (!isIsoDate(lead.firstSessionDate)) return bad("Invalid firstSessionDate.");
  if (lead.firstSessionDate < minFirstSessionDate()) {
    return bad("firstSessionDate is too early.");
  }

  if (!isValidThaiPhone(lead.tel)) return bad("Invalid tel.");

  if (!SHEET_ID || !SA_EMAIL || !SA_KEY_B64) {
    console.error("Google Sheets env vars are not configured.");
    return NextResponse.json(
      { error: "Server is not configured to accept submissions." },
      { status: 500 },
    );
  }

  // Column order — keep in sync with the sheet's header row (docs/leads.md).
  // A–I keep their original positions so the existing sheet keeps working.
  const row = [
    new Date().toISOString(), // A timestamp
    lead.condition, //           B condition
    lead.province, //            C province
    lead.district, //            D district
    lead.name, //                E name
    lead.tel, //                 F tel
    lead.firstSessionTime, //    G first-session time slot (was: doctor-consult time)
    lead.note, //                H note (was: symptoms)
    lead.onset, //               I onset (was: free-text duration)
    lead.mobility, //            J mobility
    lead.firstSessionDate, //    K first-session date (YYYY-MM-DD)
    lead.contactPref, //         L contact preference
    lead.pagePath, //            M page path
    lead.referrer, //            N referrer
    lead.utm_source, //          O utm_source
    lead.utm_medium, //          P utm_medium
    lead.utm_campaign, //        Q utm_campaign
    lead.gclid, //               R gclid
    lead.fbclid, //              S fbclid
  ];

  try {
    const sheets = getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: SHEET_RANGE,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });
  } catch (err) {
    console.error("Failed to append lead to Google Sheet:", err);
    return NextResponse.json(
      { error: "Could not save submission. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
