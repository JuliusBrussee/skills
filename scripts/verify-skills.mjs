import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("skills");
let failures = 0;

function fail(message) {
  failures += 1;
  console.error(`FAIL ${message}`);
}

function getFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : null;
}

const entries = await readdir(root, { withFileTypes: true });
const seenNames = new Map();

for (const entry of entries) {
  if (!entry.isDirectory()) continue;

  const skillPath = path.join(root, entry.name, "SKILL.md");
  let markdown;

  try {
    markdown = await readFile(skillPath, "utf8");
  } catch {
    fail(`${entry.name}: missing SKILL.md`);
    continue;
  }

  const fm = getFrontmatter(markdown);
  if (!fm) {
    fail(`${entry.name}: missing YAML frontmatter`);
    continue;
  }

  const name = fm.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = fm.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  const blockDescription = fm.match(/^description:\s*[>|]\s*$/m);

  if (!name) fail(`${entry.name}: missing name`);
  if (!description && !blockDescription) fail(`${entry.name}: missing description`);

  if (name) {
    if (seenNames.has(name)) {
      fail(`${entry.name}: duplicate name "${name}" already used by ${seenNames.get(name)}`);
    } else {
      seenNames.set(name, entry.name);
    }
  }
}

if (failures > 0) {
  console.error(`\n${failures} verification failure(s).`);
  process.exit(1);
}

console.log(`Verified ${seenNames.size} skills.`);
