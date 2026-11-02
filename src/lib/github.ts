import { cache } from "@/lib/cache";

export interface GitHubProject {
  id: number | string;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
  archived: boolean;
}

export interface ProjectGroup {
  title: string;
  projects: string[];
}

export const projectGroups: ProjectGroup[] = [
  {
    title: "Full-stack web apps",
    projects: [
      "school-managment",
      "library-management",
      "ecommerce-store",
      "budget-tracker",
      "notion-blog",
    ],
  },
  { title: "Chat apps", projects: ["chat", "chat-react"] },
  {
    title: "Utilities and developer tools",
    projects: [
      "markdown-editor",
      "toolset",
      "base-convertion",
      "truth-table",
      "website-blocker",
      "utterances",
      "book-tracker",
      "book-tracker-app",
      "odd-even",
    ],
  },
  {
    title: "Math and ML visualizers",
    projects: ["convolution-matrix", "confusion-matrix"],
  },
  {
    title: "IT Project 2023 group",
    projects: [
      "itproject2023",
      "itproject2023-lunar",
      "lunar-assistant",
      "itproject2023-assistant",
      "itproject2023-image",
      "itproject2023-qrcode",
      "itproject2023-weather",
      "itproject2023-editor",
      "itproject2023-paint",
      "itproject2023-quiz",
      "itproject2023-d-chat",
    ],
  },
  {
    title: "Python and school projects",
    projects: ["computer-project", "com-project", "robot"],
  },
  {
    title: "Portfolio and personal sites",
    projects: [
      "portfolio",
      "sudharshans2009.github.io",
      "sudharshans2009",
      "bsoundharajan",
    ],
  },
  {
    title: "Archived",
    projects: [
      "portfolio-payload",
      "notion-blog",
      "notion-blog-archived",
      "portfolio-archive-v1",
      "portfolio-archive-v2",
    ],
  },
  {
    title: "Forks",
    projects: [
      "RedditVideoMakerBot",
      "discord-dashboard-react",
      "links.madlad.store",
      "minecraft-server",
      "Minecraft-Server-on-Codespace",
      "massivedecks",
      "Presentation1",
      "Sms1",
      "IMAGE-TO-HTML-CSS",
      "HANDCRICKET-GAME",
    ],
  },
];

export const getGitHubProjects = cache(
  async (): Promise<GitHubProject[]> => {
    const response = await fetch(
      "https://api.github.com/users/sudharshans2009/repos?sort=updated&per_page=100",
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      console.error("GitHub project request failed", response.status);
      return [];
    }

    const projects = (await response.json()) as GitHubProject[];
    return projects;
  },
  ["github-projects"],
  { revalidate: 3600, tags: ["github-projects"] },
);

export function groupProjects(projects: GitHubProject[]) {
  const byName = new Map(
    projects.map((project) => [project.name.toLowerCase(), project]),
  );
  const groupedNames = new Set<string>();
  return projectGroups
    .map((group) => ({
      ...group,
      projects: group.projects
        .map((name) => {
          const normalizedName = name.toLowerCase();
          if (groupedNames.has(normalizedName)) return undefined;
          const project = byName.get(normalizedName);
          if (project) groupedNames.add(normalizedName);
          return project;
        })
        .filter((project): project is GitHubProject => Boolean(project)),
    }))
    .filter((group) => group.projects.length > 0);
}
