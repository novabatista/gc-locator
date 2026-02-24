import crypto from "crypto";

const {GOOGLE_SHEET_SERVICE_ACCOUNT, GOOGLE_SHEET_EMAIL}= process.env

export async function append(sheetId, range, rows){
  const data = {
    values: rows
  };

  const token = await getGoogleAccessToken();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=RAW`
  return fetch(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data)
    }
  ).then(res => res.json())
}


async function getGoogleAccessToken() {
  const serviceAccount = JSON.parse(GOOGLE_SHEET_SERVICE_ACCOUNT)
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: "RS256", typ: "JWT" };

  const payload = {
    iss: GOOGLE_SHEET_EMAIL,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  };

  const unsignedToken = `${base64url(header)}.${base64url(payload)}`;

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(unsignedToken);
  sign.end();

  const privateKey = serviceAccount.private_key.replace(/\\n/g, "\n");

  const signature = sign
    .sign(privateKey)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const jwt = `${unsignedToken}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt
    })
  });

  const data = await res.json();
  // console.log('OAuth Response')
  // console.log(data)

  if (!data.access_token) {
    throw new Error("Google OAuth failed: " + JSON.stringify(data));
  }

  return data.access_token;
}

function base64url(input) {
  return Buffer.from(JSON.stringify(input))
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}
