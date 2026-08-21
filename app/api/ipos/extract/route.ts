import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import { extractIPOFields } from "@/lib/ipoTextExtractor";
import { extractIPOFieldsWithAI, GEMINI_IPO_EXTRACTION_MODEL } from "@/lib/ipoAIExtractor";
import type { IPOExtractionInputType } from "@/lib/ipoTextExtractor";

export const runtime = "nodejs";

const MAX_PDF_SIZE = 10 * 1024 * 1024;
const MAX_TEXT_SIZE = 250_000;

function authorizeAdmin(request: Request) {
  const expectedKey = process.env.ADMIN_API_KEY;
  const authorization = request.headers.get("authorization");
  const suppliedKey = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!expectedKey) return NextResponse.json({ message: "Admin extraction is not configured." }, { status: 503 });

  const expected = Buffer.from(expectedKey);
  const supplied = Buffer.from(suppliedKey);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  return null;
}

export async function extractSource(
  pages: Array<{ page?: number; text: string }>,
  inputType: IPOExtractionInputType,
  semanticExtractor = extractIPOFieldsWithAI
) {
  const deterministic = extractIPOFields(pages, inputType);
  try {
    if (process.env.NODE_ENV !== "production") {
      console.info("IPO extraction provider: Gemini", { model: GEMINI_IPO_EXTRACTION_MODEL });
    }
    const semantic = await semanticExtractor(pages, inputType);
    const semanticFields = new Set(semantic.fields.map((field) => field.field));
    return {
      ...semantic,
      fields: [...semantic.fields, ...deterministic.fields.filter((field) => !semanticFields.has(field.field))],
      warnings: [...new Set([...semantic.warnings, ...deterministic.warnings])],
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown AI extraction failure.";
    return {
      ...deterministic,
      extractionMethod: "DETERMINISTIC_FALLBACK" as const,
      warnings: [...deterministic.warnings, `Gemini AI extraction unavailable (${reason}). Deterministic extraction was used; manually verify every field.`],
    };
  }
}

export async function POST(request: Request) {
  const unauthorized = authorizeAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const inputType = formData.get("inputType");

    if (inputType === "TEXT") {
      const text = formData.get("text");
      if (typeof text !== "string" || !text.trim()) {
        return NextResponse.json({ message: "Paste verified IPO text before extracting." }, { status: 400 });
      }
      if (text.length > MAX_TEXT_SIZE) {
        return NextResponse.json({ message: "Pasted text is too large." }, { status: 413 });
      }
      const extraction = await extractSource([{ text }], "TEXT");
      if (extraction.fields.length === 0) {
        return NextResponse.json({ message: "No recognized IPO fields were found in the pasted text." }, { status: 422 });
      }
      return NextResponse.json(extraction);
    }

    if (inputType !== "PDF") {
      return NextResponse.json({ message: "Input type must be TEXT or PDF." }, { status: 400 });
    }

    const file = formData.get("file");
    if (!(file instanceof File) || file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ message: "Upload a valid PDF file." }, { status: 400 });
    }
    if (file.size === 0 || file.size > MAX_PDF_SIZE) {
      return NextResponse.json({ message: "PDF must be between 1 byte and 10 MB." }, { status: 413 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    if (new TextDecoder("ascii").decode(bytes.slice(0, 5)) !== "%PDF-") {
      return NextResponse.json({ message: "The uploaded file is not a valid PDF." }, { status: 400 });
    }

    const parser = new PDFParse({ data: bytes });
    try {
      const result = await parser.getText();
      const pages = result.pages.map((page) => ({ page: page.num, text: page.text }));
      if (!pages.some((page) => page.text.trim())) {
        return NextResponse.json({ message: "No extractable text was found in this PDF." }, { status: 422 });
      }
      const extraction = await extractSource(pages, "PDF");
      if (extraction.fields.length === 0) {
        return NextResponse.json({ message: "No recognized IPO fields were found in this PDF." }, { status: 422 });
      }
      return NextResponse.json(extraction);
    } finally {
      await parser.destroy();
    }
  } catch (error) {
    console.error("IPO SOURCE EXTRACTION ERROR:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ message: "Unable to extract this source. Verify the file or text and try again." }, { status: 422 });
  }
}
