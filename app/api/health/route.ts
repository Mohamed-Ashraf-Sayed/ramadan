import { NextResponse } from "next/server";

export async function GET() {
  const checks: Record<string, string> = {
    status: "ok",
    timestamp: new Date().toISOString(),
    node_version: process.version,
    env_database_url: process.env.DATABASE_URL ? "set" : "NOT SET",
    env_nextauth_secret: process.env.NEXTAUTH_SECRET ? "set" : "NOT SET",
    env_nextauth_url: process.env.NEXTAUTH_URL || "NOT SET",
    env_node_env: process.env.NODE_ENV || "NOT SET",
  };

  // Test database connection
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "connected";
  } catch (e: unknown) {
    const error = e as Error;
    checks.database = `error: ${error.message}`;
  }

  return NextResponse.json(checks);
}
