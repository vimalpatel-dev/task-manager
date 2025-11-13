import { adminFirestore } from "@/utils/firebaseAdmin";
import { getUserFromHeader } from "@/utils/getUserFromHeader";
import { successResponse, errorResponse } from "@/utils/apiResponse";

export async function GET(req: Request) {
  try {
    const user = getUserFromHeader(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const snapshot = await adminFirestore
      .collection("projects")
      .where("owner", "==", user.uid)
      .get();

    const projects = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return successResponse("Projects fetched successfully", { projects });
  } catch (err: any) {
    return errorResponse(err.message, 500);
  }
}

export async function POST(req: Request) {
  try {
    const user = getUserFromHeader(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const { name, description } = await req.json();
    if (!name || !description) return errorResponse("Project name & description is required", 400);

    const docRef = await adminFirestore.collection("projects").add({
      name,
      description,
      owner: user.uid,
      createdAt: new Date().toISOString(),
    });

    const created = (await docRef.get()).data();
    return successResponse("Project created successfully", { project: { id: docRef.id, ...created } }, 201);
  } catch (err: any) {
    return errorResponse(err.message, 500);
  }
}
