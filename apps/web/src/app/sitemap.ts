import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db";
import { skills, repos } from "@skillshub/db/schema";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = getDb();

  const rows = await db
    .select({
      slug: skills.slug,
      githubOwner: repos.githubOwner,
      githubRepoName: repos.githubRepoName,
      updatedAt: skills.updatedAt,
    })
    .from(skills)
    .innerJoin(repos, eq(skills.repoId, repos.id))
    .where(eq(skills.isPublished, true));

  const skillPages: MetadataRoute.Sitemap = rows.map((row) => ({
    url: `https://skillshub.wtf/${row.githubOwner}/${row.githubRepoName}/${row.slug}`,
    lastModified: row.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: "https://skillshub.wtf",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://skillshub.wtf/skills",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...skillPages,
  ];
}
