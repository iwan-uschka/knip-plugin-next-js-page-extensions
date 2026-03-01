import { NextResponse } from "next/server";

export function middleware() {
  const response = NextResponse.next();

  console.log("Next.js middleware");

  // do some magic

  return response;
}
