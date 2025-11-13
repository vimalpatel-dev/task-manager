import { verifyJwt } from "./jwt";

export function getUserFromHeader(req: Request) {
  const auth = req.headers.get("authorization") || "";
  let token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  return verifyJwt(token);
}
