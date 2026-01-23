import fs from "node:fs/promises";
import path from "node:path";

async function fileExists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function downloadText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download (${res.status})`);
  return await res.text();
}

export async function ensureFileFromUrl(opts: {
  url: string;
  destPath: string;
  validateText?: (text: string) => void;
  logPrefix?: string;
}): Promise<string> {
  const { url, destPath, validateText, logPrefix = "[file]" } = opts;

  if (await fileExists(destPath)) return destPath;

  await fs.mkdir(path.dirname(destPath), { recursive: true });

  console.log(`${logPrefix} Missing; downloading ${url}`);
  const text = await downloadText(url);

  validateText?.(text);

  const tmp = `${destPath}.tmp`;
  await fs.writeFile(tmp, text, "utf8");
  await fs.rename(tmp, destPath);

  console.log(`${logPrefix} Saved to ${destPath}`);
  return destPath;
}
