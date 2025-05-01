import { NextResponse } from "next/server";
import { getMemorialMessages } from "@/app/actions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || "10");
  const showModerated = searchParams.get("showModerated") === "true";

  try {
    const data = await getMemorialMessages(page, perPage, showModerated);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch memorial messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch memorial messages" },
      { status: 500 }
    );
  }
}
