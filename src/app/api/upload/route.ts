import { NextResponse } from "next/server";
import storage from "@/lib/storage";
import { checkAdminStatus } from "@/lib/auth";
export async function POST(request: Request): Promise<NextResponse> {
  const isAdmin = await checkAdminStatus();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json(
      { error: "Filename is required" },
      { status: 400 }
    );
  }

  try {
    const blob = await request.blob();
    const url = await storage.saveFile(filename, blob);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
