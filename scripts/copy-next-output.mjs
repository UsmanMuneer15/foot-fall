import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const source = join(root, "footfall", ".next");
const target = join(root, ".next");

if (!existsSync(source)) {
  console.error(
    "Missing footfall/.next — the website build did not produce an output folder.",
  );
  process.exit(1);
}

rmSync(target, { recursive: true, force: true });
cpSync(source, target, { recursive: true });
console.log("Copied footfall/.next → .next for Vercel");
