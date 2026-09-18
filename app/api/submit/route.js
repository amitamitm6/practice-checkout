import { google } from "googleapis";
import { NextResponse } from "next/server";

function orEmpty(value) {
  return value || "-";
}

const FULL_NAME_REGEX = /^[\p{L}\-']+(?:\s+[\p{L}\-']+)+$/u;

export async function POST(request) {
  const body = await request.json();
  const {
    fullName,
    email,
    phone,
    country,
    address,
    zip,
    product,
    cardNumber,
    expiryDate,
    cvv,
  } = body;

  if (!fullName || !email || !country) {
    return NextResponse.json(
      { error: "Full name, email and country are required." },
      { status: 400 }
    );
  }

  if (!FULL_NAME_REGEX.test(fullName.trim())) {
    return NextResponse.json(
      { error: "Please enter your full name (first and last name)." },
      { status: 400 }
    );
  }

  const timestamp = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Jerusalem",
  });

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Orders!A1",
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          timestamp,
          fullName,
          orEmpty(phone),
          email,
          country,
          orEmpty(address),
          orEmpty(zip),
          product,
          cardNumber,
          expiryDate,
          cvv,
        ],
      ],
    },
  });

  return NextResponse.json({ ok: true });
}
