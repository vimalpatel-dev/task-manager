import { signJwt } from "@/utils/jwt";
import { successResponse, errorResponse } from "@/utils/apiResponse";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return errorResponse("Email and password required", 400);
    }

    const key = process.env.FIREBASE_API_KEY;

    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );
    const data = await res.json();

    if (data.error) return errorResponse(data.error.message, 400);

    const token = signJwt({ uid: data.localId, email: data.email });

    const nextRes = successResponse("Login successful", {
      token,
      uid: data.localId,
      email: data.email,
    });

    return nextRes;
  } catch (err: any) {
    return errorResponse(err.message || "Unexpected error", 500);
  }
}
