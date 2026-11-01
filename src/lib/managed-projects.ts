import { desc } from "drizzle-orm";
import { db } from "@/database/client";
import { project } from "@/database/schema";
import { getGitHubProjects } from "@/lib/github";

export async function getManagedProjects() {
  const [githubProjects, overrides] = await Promise.all([
    getGitHubProjects(),
    db.select().from(project).orderBy(desc(project.updatedAt)),
  ]);
  if (overrides.length === 0) return [];

  const managedGitHubProjects = overrides
    .filter((item) => item.githubName && item.visible)
    .map((override) => {
      const item = githubProjects.find(
        (githubProject) =>
          githubProject.name.toLowerCase() === override.githubName!.toLowerCase(),
      );
      if (!item) return null;
      return {
        ...item,
        name: override.name,
        description: override.description,
        html_url: override.url,
        language: override.language,
        topics: override.topics,
        featured: override.featured,
        managedId: override.id,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const customProjects = overrides
    .filter((item) => !item.githubName && item.visible)
    .map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      html_url: item.url,
      homepage: null,
      language: item.language,
      topics: item.topics,
      stargazers_count: 0,
      updated_at: item.updatedAt.toISOString(),
      fork: false,
      archived: false,
      featured: item.featured,
      managedId: item.id,
    }));

  return [...managedGitHubProjects, ...customProjects];
}

export async function getAdminProjects() {
  const [githubProjects, overrides] = await Promise.all([
    getGitHubProjects(),
    db.select().from(project).orderBy(desc(project.updatedAt)),
  ]);
  const overrideByName = new Map(
    overrides.filter((item) => item.githubName).map((item) => [item.githubName!.toLowerCase(), item]),
  );
  const githubRows = githubProjects.map((item) => ({
    id: overrideByName.get(item.name.toLowerCase())?.id ?? item.name,
    githubName: item.name,
    name: overrideByName.get(item.name.toLowerCase())?.name ?? item.name,
    description: overrideByName.get(item.name.toLowerCase())?.description ?? item.description,
    url: overrideByName.get(item.name.toLowerCase())?.url ?? item.html_url,
    language: overrideByName.get(item.name.toLowerCase())?.language ?? item.language,
    topics: overrideByName.get(item.name.toLowerCase())?.topics ?? item.topics,
    featured: overrideByName.get(item.name.toLowerCase())?.featured ?? false,
    visible: overrideByName.get(item.name.toLowerCase())?.visible ?? true,
    isCustom: false,
  }));
  const customRows = overrides
    .filter((item) => !item.githubName)
    .map((item) => ({ ...item, isCustom: true }));
  return [...githubRows, ...customRows];
}
