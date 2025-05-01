import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

export async function checkAdminStatus() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token) return false;

  try {
    verify(token.value, JWT_SECRET!);
    return true;
  } catch {
    return false;
  }
}
