import { adminAuth, adminFirestore } from "@/utils/firebaseAdmin";
import { errorResponse, successResponse } from "@/utils/apiResponse";

export async function POST(req: Request) {
  try {
    const { email, password, displayName } = await req.json();
    if (!email || !password) {
      return errorResponse("Email and password required", 400);
    }

    const user = await adminAuth.createUser({ email, password, displayName });
    await adminFirestore.collection("users").doc(user.uid).set({
      email,
      displayName,
      createdAt: new Date().toISOString(),
    });

    const nextRes = successResponse("Register successful", {
      uid: user.uid,
      email: user.email,
    });

    return nextRes
  } catch (err: any) {
    return errorResponse(err.message || "Unexpected error", 500);
  }
}
