import "dotenv/config";
import { client, db } from "../src/database/client";
import { projectGroups, getGitHubProjects } from "../src/lib/github";
import { project } from "../src/database/schema";

const githubNames = [
  ...new Set(projectGroups.flatMap((group) => group.projects)),
];
const githubNameSet = new Set(githubNames.map((name) => name.toLowerCase()));
const githubProjects = await getGitHubProjects();
const selectedProjects = githubProjects.filter((item) =>
  githubNameSet.has(item.name.toLowerCase()),
);

for (const item of selectedProjects) {
  await db
    .insert(project)
    .values({
      id: crypto.randomUUID(),
      githubName: item.name,
      name: item.name,
      description: item.description,
      url: item.html_url,
      language: item.language,
      topics: item.topics,
      featured: false,
      visible: true,
    })
    .onConflictDoUpdate({
      target: project.githubName,
      set: {
        description: item.description,
        url: item.html_url,
        language: item.language,
        topics: item.topics,
        updatedAt: new Date(),
      },
    });
}

console.log(`Seeded ${selectedProjects.length} projects.`);
await client.end();
