import { Request, Response } from "express";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";

const prisma = new PrismaClient();
const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
const googleRedirectUri =
  process.env.GOOGLE_REDIRECT_URI || process.env.GOOGLE_REDIRECT_URL || "";
const frontendBaseUrl =
  process.env.FRONTEND_BASE_URL ||
  process.env.FRONTEND_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3000");

// Log OAuth configuration status on startup
console.log("[OAuth] Configuration status:");
console.log(
  "[OAuth] GOOGLE_CLIENT_ID:",
  googleClientId ? "✓ Set" : "✗ Missing"
);
console.log(
  "[OAuth] GOOGLE_CLIENT_SECRET:",
  googleClientSecret ? "✓ Set" : "✗ Missing"
);
console.log(
  "[OAuth] GOOGLE_REDIRECT_URI:",
  googleRedirectUri ? `✓ Set (${googleRedirectUri})` : "✗ Missing"
);
console.log(
  "[OAuth] FRONTEND_BASE_URL:",
  frontendBaseUrl ? `✓ Set (${frontendBaseUrl})` : "✗ Missing"
);

const googleClient = new OAuth2Client({
  clientId: googleClientId,
  clientSecret: googleClientSecret,
  redirectUri: googleRedirectUri,
});

function setCookie(
  res: Response,
  name: string,
  value: string,
  maxAgeSec: number
) {
  const cookie =
    `${name}=${encodeURIComponent(
      value
    )}; Path=/; Max-Age=${maxAgeSec}; SameSite=Lax` +
    (process.env.NODE_ENV === "production" ? "; Secure" : "");
  res.setHeader(
    "Set-Cookie",
    [cookie].concat((res.getHeader("Set-Cookie") as any) || [])
  );
}

function getCookie(req: Request, name: string): string | undefined {
  const header = req.headers.cookie || "";
  const parts = header.split(/;\s*/);
  for (const part of parts) {
    const [k, ...rest] = part.split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: Role.STUDENT, //default role is student
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(201).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return res.json({
      user: {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body as { idToken?: string };
    if (!idToken)
      return res.status(400).json({ message: "idToken is required" });
    if (!googleClientId) {
      console.error("[OAuth] GOOGLE_CLIENT_ID environment variable is not set");
      return res.status(500).json({
        message: "Google client not configured",
        missingVariable: "GOOGLE_CLIENT_ID",
        details:
          "Please set the GOOGLE_CLIENT_ID environment variable in your production environment",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const email = payload.email;
    const firstName = payload.given_name || "";
    const lastName = payload.family_name || "";
    const avatar = payload.picture || null;
    const sub = payload.sub; // Google user id

    // Link or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          password: "google-oauth", // placeholder, not used for login
          firstName,
          lastName,
          role: Role.STUDENT,
          googleId: sub,
          avatar, // must be string | null per Prisma types
        },
      });
    } else if (!user.googleId) {
      // Attach googleId and avatar if not already linked
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: user.googleId ?? sub,
          avatar: user.avatar ?? avatar ?? null,
        },
      });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    return res.json({
      user: { userId: user.id, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Google login failed" });
  }
};

export const googleOAuthStart = async (req: Request, res: Response) => {
  try {
    // Check which environment variables are missing
    const missingVars = [];
    if (!googleClientId) missingVars.push("GOOGLE_CLIENT_ID");
    if (!googleClientSecret) missingVars.push("GOOGLE_CLIENT_SECRET");
    if (!googleRedirectUri)
      missingVars.push("GOOGLE_REDIRECT_URI or GOOGLE_REDIRECT_URL");

    if (missingVars.length > 0) {
      console.error("[OAuth] Missing environment variables:", missingVars);
      return res.status(500).json({
        message: "Google OAuth not configured",
        missingVariables: missingVars,
        details:
          "Please set the required Google OAuth environment variables in your production environment",
      });
    }
    const nonce = crypto.randomBytes(16).toString("hex");
    const redirect =
      typeof req.query.redirect === "string" ? req.query.redirect : "/";
    const stateObj = { n: nonce, r: redirect };
    const state = Buffer.from(JSON.stringify(stateObj)).toString("base64url");
    setCookie(res, "oauth_state_nonce", nonce, 600);

    const url = googleClient.generateAuthUrl({
      access_type: "offline",
      scope: ["openid", "email", "profile"],
      include_granted_scopes: true,
      prompt: "consent",
      state,
    });
    console.log("[OAuth] Using redirect URI:", googleRedirectUri);
    console.log("[OAuth] Generated Google auth URL:", url);
    console.log(
      "[OAuth] WARNING: If you see localhost in the redirect, check your Google Cloud Console OAuth configuration!"
    );
    return res.redirect(url);
  } catch (e) {
    return res.status(500).json({ message: "Failed to start Google OAuth" });
  }
};

export const googleOAuthCallback = async (req: Request, res: Response) => {
  try {
    const code =
      typeof req.query.code === "string" ? req.query.code : undefined;
    const stateB64 =
      typeof req.query.state === "string" ? req.query.state : undefined;
    if (!code || !stateB64) return res.status(400).send("Missing code/state");

    const { n: nonce, r: redirect } = JSON.parse(
      Buffer.from(stateB64, "base64url").toString("utf8")
    );
    const cookieNonce = getCookie(req, "oauth_state_nonce");
    if (!cookieNonce || cookieNonce !== nonce)
      return res.status(400).send("Invalid state");

    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);

    // Fetch profile
    const accessToken = tokens.access_token;
    if (!accessToken) return res.status(401).send("No access token");
    const ures = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (!ures.ok) return res.status(401).send("Failed to fetch userinfo");
    const profile: any = await ures.json();

    console.log("[OAuth] Google profile:", {
      email: profile.email,
      picture: profile.picture,
    });

    const email: string | undefined = profile.email;
    if (!email) return res.status(401).send("No email in profile");
    const firstName: string = profile.given_name || "";
    const lastName: string = profile.family_name || "";
    const avatar: string | null = profile.picture || null;
    const sub: string = profile.sub;

    console.log("[OAuth] Extracted data:", {
      email,
      firstName,
      lastName,
      avatar,
      sub,
    });

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("[OAuth] Creating new user with avatar:", avatar);
      user = await prisma.user.create({
        data: {
          email,
          password: "google-oauth",
          firstName,
          lastName,
          role: Role.STUDENT,
          googleId: sub,
          avatar,
        },
      });
    } else if (!user.googleId) {
      console.log("[OAuth] Updating existing user with avatar:", avatar);
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: user.googleId ?? sub,
          avatar: user.avatar ?? avatar ?? null,
        },
      });
    }

    console.log("[OAuth] Final user object:", {
      id: user.id,
      email: user.email,
      avatar: user.avatar,
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Validate frontend URL in production
    if (!frontendBaseUrl) {
      console.error("[OAuth] FRONTEND_BASE_URL is not set in production");
      return res.status(500).send("Frontend URL not configured");
    }

    const dest = `${frontendBaseUrl}/auth/callback?token=${encodeURIComponent(
      token
    )}&to=${encodeURIComponent(redirect || "/")}`;
    console.log("[OAuth] Redirecting to:", dest);
    return res.redirect(dest);
  } catch (e) {
    console.error(e);
    return res.status(500).send("OAuth callback failed");
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        role: true,
        club: {
          select: { id: true, name: true, imageUrl: true },
        },
      },
    });

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // Prevent stale 304s and ensure fresh body with avatar reaches the client
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Vary", "Authorization, Cookie");

    console.log("[Auth/Me] Returning user:", {
      id: user.id,
      email: user.email,
      avatar: user.avatar,
    });

    return res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
