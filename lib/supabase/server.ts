import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const cookieStore = await cookies();

  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
    },
    setAll(cookieValues) {
      cookieValues.forEach(({ name, value, options }) => {
        cookieStore.set({ name, value, ...options });
      });
    },
  };

  return createServerClient(url, anonKey, {
    cookies: cookieMethods,
  });
}
