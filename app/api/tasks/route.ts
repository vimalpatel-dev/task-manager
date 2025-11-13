import { adminFirestore } from "@/utils/firebaseAdmin";
import { getUserFromHeader } from "@/utils/getUserFromHeader";
import { successResponse, errorResponse } from "@/utils/apiResponse";

export async function GET(req: Request) {
  try {
    const user = getUserFromHeader(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    if (!projectId) return errorResponse("projectId required", 400);

    const snapshot = await adminFirestore
      .collection("tasks")
      .where("projectId", "==", projectId)
      .where("owner", "==", user.uid)
      .get();

    const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return successResponse("Tasks fetched successfully", { tasks });
  } catch (err: any) {
    return errorResponse(err.message, 500);
  }
}

export async function POST(req: Request) {
  try {
    const user = getUserFromHeader(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const { projectId, title, status = "Todo", dueDate = null } = await req.json();
    if (!projectId || !title) return errorResponse("projectId and title required", 400);

    const doc = await adminFirestore.collection("tasks").add({
      projectId,
      title,
      status,
      dueDate,
      owner: user.uid,
      createdAt: new Date().toISOString(),
    });

    const created = (await doc.get()).data();
    return successResponse("Task created successfully", { task: { id: doc.id, ...created } }, 201);
  } catch (err: any) {
    return errorResponse(err.message, 500);
  }
}

export async function PUT(req: Request) {
  try {
    const user = getUserFromHeader(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const { id, updates } = await req.json();
    if (!id || !updates) return errorResponse("id and updates required", 400);

    const docRef = adminFirestore.collection("tasks").doc(id);
    const docSnapshot = await docRef.get();
    if (!docSnapshot.exists) return errorResponse("Task not found", 404);
    const docData = docSnapshot.data();
    if (docData?.owner !== user.uid) return errorResponse("Unauthorized", 403);

    await docRef.update({
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return successResponse("Task updated successfully");
  } catch (err: any) {
    return errorResponse(err.message, 500);
  }
}

export async function DELETE(req: Request) {
  try {
    const user = getUserFromHeader(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return errorResponse("id required", 400);

    const docRef = adminFirestore.collection("tasks").doc(id);
    const docSnapshot = await docRef.get();
    if (!docSnapshot.exists) return errorResponse("Task not found", 404);
    if (docSnapshot.data()?.owner !== user.uid) return errorResponse("Unauthorized", 403);

    await docRef.delete();
    return successResponse("Task deleted successfully");
  } catch (err: any) {
    return errorResponse(err.message, 500);
  }
}
