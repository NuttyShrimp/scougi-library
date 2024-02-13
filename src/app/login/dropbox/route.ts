import { generateState } from "arctic";
import { dropbox } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
  const state = generateState();
  const url = await dropbox.createAuthorizationURL(state, {
    scopes: ["email", "profile", "account_info.read"]
  });

  cookies().set("dropbox_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax"
  });

  return Response.redirect(url);
}
