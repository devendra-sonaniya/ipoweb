import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "allotmentStatus.json");

export async function GET() {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]", "utf8");
    }
    
    const fileData = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileData);

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET ALLOTMENT STATUS ERROR:", error);

    return NextResponse.json(
      {
        message: "Unable to load allotment status.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const newRecord = await request.json();

    const fileData = fs.readFileSync(filePath, "utf8");
    const records = JSON.parse(fileData);

    records.push(newRecord);

    fs.writeFileSync(filePath, JSON.stringify(records, null, 2), "utf8");

    return NextResponse.json(
      {
        message: "Allotment status saved successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST ALLOTMENT STATUS ERROR:", error);

    return NextResponse.json(
      {
        message: "Unable to save allotment status.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}