import { google } from "googleapis";
import { NextResponse, type NextRequest } from "next/server";

// Sheets API needs Node built-ins (crypto, etc.), so force the Node runtime.
export const runtime = "nodejs";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SA_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
// Base64-encoded service-account private key (avoids newline/quote mangling
// in host env UIs like Netlify). Decode to PEM at use.
const SA_KEY_B64 = process.env.GOOGLE_PRIVATE_KEY_B64;

// Tab + range to append into. Override via env if your tab isn't named "Leads".
const SHEET_RANGE = process.env.GOOGLE_SHEET_RANGE ?? "Leads!A:I";

type LeadPayload = {
  condition?: string;
  province?: string;
  district?: string;
  name?: string;
  tel?: string;
  preferredTime?: string;
  symptoms?: string;
  duration?: string;
};

function getSheetsClient() {
  const privateKey = Buffer.from(SA_KEY_B64!, "base64").toString("utf8");

  const auth = new google.auth.JWT({
    email: SA_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export async function POST(request: NextRequest) {
  if (!SHEET_ID || !SA_EMAIL || !SA_KEY_B64) {
    console.error("Google Sheets env vars are not configured.");
    return NextResponse.json(
      { error: "Server is not configured to accept submissions." },
      { status: 500 },
    );
  }

  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim();
  const tel = body.tel?.trim();

  // Mirrors the `required` fields in the form.
  if (!name || !tel || !body.condition || !body.province || !body.district) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 },
    );
  }

  // Column order — keep in sync with the header row in the sheet.
  const row = [
    new Date().toISOString(),
    body.condition,
    body.province,
    body.district,
    name,
    tel,
    body.preferredTime?.trim() ?? "",
    body.symptoms?.trim() ?? "",
    body.duration?.trim() ?? "",
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
