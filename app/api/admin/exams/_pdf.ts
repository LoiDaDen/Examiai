import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function extractPdfText(buffer: Buffer) {
  const dir = await mkdtemp(path.join(tmpdir(), "examinai-pdf-"));
  const pdfPath = path.join(dir, "import.pdf");

  try {
    await writeFile(pdfPath, buffer);
    const { stdout } = await execFileAsync("pdftotext", [
      "-layout",
      pdfPath,
      "-",
    ]);
    return stdout;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

export async function getPdfBufferFromRequest(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (
    !file ||
    typeof file !== "object" ||
    typeof (file as Blob).arrayBuffer !== "function"
  ) {
    return null;
  }

  return Buffer.from(await (file as Blob).arrayBuffer());
}

export function compactPdfText(text: string, maxLength = 42000) {
  return text
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .slice(0, maxLength);
}
