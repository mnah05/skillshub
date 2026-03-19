import "dotenv/config";
import { createDb } from "./client.js";
import { users, repos, skills } from "./schema.js";
import { eq, and, sql } from "drizzle-orm";
import matter from "gray-matter";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const headers: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "User-Agent": "skillshub-importer-batch7b",
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const db = createDb();
  const owner = "ComposioHQ";
  const repoName = "awesome-claude-skills";
  const branch = "master";

  // Get tree
  const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/trees/${branch}?recursive=1`, { headers });
  const tree = await treeRes.json();
  const skillFiles = tree.tree.filter((t: any) => t.path.endsWith("SKILL.md")).slice(400); // Skip first 400 (already imported)
  console.log(`Found ${skillFiles.length} remaining SKILL.md files to import`);

  // Get repo record
  const [repo] = await db.select().from(repos).where(and(eq(repos.githubOwner, owner), eq(repos.githubRepoName, repoName))).limit(1);
  if (!repo) { console.error("Repo not found!"); return; }

  const [user] = await db.select().from(users).where(eq(users.username, owner)).limit(1);
  if (!user) { console.error("User not found!"); return; }

  let imported = 0;
  for (const file of skillFiles) {
    const slug = file.path.split("/").slice(-2, -1)[0] || file.path.replace(/\/SKILL\.md$/, "").split("/").pop();
    if (!slug) continue;

    // Check if exists
    const existing = await db.select({ id: skills.id }).from(skills).where(and(eq(skills.slug, slug), eq(skills.repoId, repo.id))).limit(1);
    if (existing.length > 0) continue;

    // Fetch content
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/${file.path}`;
    const res = await fetch(rawUrl, { headers: { "User-Agent": "skillshub-importer" } });
    if (!res.ok) { await sleep(500); continue; }
    const content = await res.text();

    let name = slug;
    let description = "";
    try {
      const { data, content: body } = matter(content);
      name = data.name || slug;
      description = (data.description || body.slice(0, 500)).slice(0, 500);
    } catch { description = content.slice(0, 500); }

    await db.insert(skills).values({
      slug, name, description: description || `Skill for ${name}`,
      readme: content, repoId: repo.id, ownerId: user.id,
      isPublished: true, source: "github",
    });
    imported++;
    if (imported % 50 === 0) { console.log(`  Imported ${imported}...`); await sleep(1000); }
    await sleep(200);
  }
  console.log(`✅ Imported ${imported} additional ComposioHQ skills`);
}

main().catch(console.error);
