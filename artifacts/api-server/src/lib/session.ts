import type { Request, Response, NextFunction } from "express";
import { db, usersTable, type User } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";
export const COOKIE_NAME = "ss_session";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

function sign(value: string): string {
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
  return `${value}.${sig}`;
}

function verify(signed: string): string | null {
  const idx = signed.lastIndexOf(".");
  if (idx === -1) return null;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
  if (sig.length !== expected.length) return null;
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) return null;
  } catch {
    return null;
  }
  return value;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

async function resetIfNewDay(user: User): Promise<User> {
  const today = todayStr();
  if (user.lastResetDate !== today) {
    const [updated] = await db
      .update(usersTable)
      .set({
        messagesUsedToday: 0,
        quizzesUsedToday: 0,
        voiceUsedToday: 0,
        lastResetDate: today,
      })
      .where(eq(usersTable.id, user.id))
      .returning();
    return updated;
  }
  return user;
}

async function downgradeIfExpired(user: User): Promise<User> {
  if (user.isPremium && user.premiumUntil && new Date(user.premiumUntil).getTime() <= Date.now()) {
    const [updated] = await db
      .update(usersTable)
      .set({ isPremium: false })
      .where(eq(usersTable.id, user.id))
      .returning();
    return updated;
  }
  return user;
}

export function setSessionCookie(res: Response, userId: number): void {
  res.cookie(COOKIE_NAME, sign(String(userId)), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 365,
    path: "/",
  });
}

export async function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const cookie = req.cookies?.[COOKIE_NAME] as string | undefined;
    let userId: number | null = null;
    if (cookie) {
      const verified = verify(cookie);
      if (verified) {
        const parsed = parseInt(verified, 10);
        if (!isNaN(parsed)) userId = parsed;
      }
    }

    if (userId === null) {
      res.status(401).json({ error: "Authentication required", code: "AUTH_REQUIRED" });
      return;
    }

    const rows = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    let user = rows[0];

    if (!user) {
      res.status(401).json({ error: "Session expired. Please sign in again.", code: "SESSION_EXPIRED" });
      return;
    }

    user = await downgradeIfExpired(user);
    user = await resetIfNewDay(user);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export function isPremiumActive(user: User): boolean {
  if (!user.isPremium) return false;
  if (!user.premiumUntil) return false;
  return new Date(user.premiumUntil).getTime() > Date.now();
}

export const LIMITS = {
  messages: { free: 25, grace: 2 },
  quizzes: { free: 2 },
  voice: { free: 5 },
};
