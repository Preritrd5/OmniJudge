import crypto from "node:crypto";

export interface TeamTokenPayload {
  teamId: string;
  email: string;
  teamName: string;
  leaderName?: string;
  iat: number;
  exp: number; // Unix timestamp in seconds
}

function getSecret(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "sih-premier-2026-team-cryptographic-session-token-secret-key-99!"
  );
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str, "utf8")
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  return Buffer.from(str, "base64").toString("utf8");
}

/**
 * Sign a team session token with HMAC-SHA256.
 * Valid for 7 days by default.
 */
export function signTeamSessionToken(payload: {
  teamId: string;
  email: string;
  teamName: string;
  leaderName?: string;
  expiresInSeconds?: number;
}): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + (payload.expiresInSeconds ?? 7 * 24 * 60 * 60); // 7 days

  const tokenPayload: TeamTokenPayload = {
    teamId: payload.teamId,
    email: payload.email.trim().toLowerCase(),
    teamName: payload.teamName.trim(),
    leaderName: payload.leaderName ? payload.leaderName.trim() : undefined,
    iat,
    exp,
  };

  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));

  const secret = getSecret();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export interface VerifyTokenResult {
  valid: boolean;
  payload?: TeamTokenPayload;
  error?: string;
}

/**
 * Verify and decode an HMAC-SHA256 team session token.
 */
export function verifyTeamSessionToken(token?: string | null): VerifyTokenResult {
  if (!token || typeof token !== "string") {
    return { valid: false, error: "Missing token" };
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return { valid: false, error: "Malformed token structure" };
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const secret = getSecret();

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  // Constant-time comparison to prevent timing attacks
  const sigBuf = Buffer.from(signature, "utf8");
  const expBuf = Buffer.from(expectedSignature, "utf8");

  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return { valid: false, error: "Invalid cryptographic signature" };
  }

  try {
    const payloadStr = base64UrlDecode(encodedPayload);
    const payload: TeamTokenPayload = JSON.parse(payloadStr);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, error: "Token expired" };
    }

    if (!payload.teamId || !payload.email) {
      return { valid: false, error: "Incomplete token payload" };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: err?.message || "Failed to decode token payload" };
  }
}
