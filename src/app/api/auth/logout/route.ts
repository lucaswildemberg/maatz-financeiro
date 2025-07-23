import { NextRequest, NextResponse } from "next/server";
import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function POST(request: NextRequest) {
  await logout();
  redirect("/login");
}