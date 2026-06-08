import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("skills");

function frontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const data = {};
  const lines = match[1].split("\n");
  let currentKey = null;
  let block = [];

  for (const line of lines) {
    const keyValue = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (keyValue) {
      if (currentKey) data[currentKey] = block.join(" ").trim();
      currentKey = keyValue[1];
      const value = keyValue[2].trim();
      block = value === "|" || value === ">" ? [] : [value.replace(/^["']|["']$/g, "")];
      continue;
    }

    if (currentKey && line.startsWith("  ")) {
      block.push(line.trim());
    }
  }

  if (currentKey) data[currentKey] = block.join(" ").trim();
  return data;
}

const entries = await readdir(root, { withFileTypes: true });
const skills = [];

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const file = path.join(root, entry.name, "SKILL.md");
  try {
    const markdown = await readFile(file, "utf8");
    const meta = frontmatter(markdown);
    skills.push({
      dir: entry.name,
      name: meta.name || entry.name,
      description: meta.description || ""
    });
  } catch {
    skills.push({ dir: entry.name, name: entry.name, description: "Missing SKILL.md" });
  }
}

skills.sort((a, b) => a.name.localeCompare(b.name));

for (const skill of skills) {
  const description = skill.description.replace(/\s+/g, " ");
  console.log(`${skill.name} - ${description}`);
}
