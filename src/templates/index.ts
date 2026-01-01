// @aibos/docs-registry — Template Exports
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Get default template path.
 */
export function getDefaultTemplatePath(name: string): string {
  return path.join(__dirname, name);
}

/**
 * Read default header template.
 */
export function getHeaderTemplate(): string {
  return fs.readFileSync(getDefaultTemplatePath("header.md.hbs"), "utf8");
}
