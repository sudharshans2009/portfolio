import { Github } from "lucide-react";
import { generateMetadata } from "@/lib/metadata";
import { getGitHubProjects, groupProjects } from "@/lib/github";
import { siteConfig } from "@/lib/site-config";
import ProjectCard from "@/components/project-card";
import ProjectsUnavailable from "@/components/projects-unavailable";

export const metadata = generateMetadata(
  "Projects — SS.me",
  "Coding projects by Sudharshan S, built with TypeScript, JavaScript, and Python.",
  "/projects",
);

export default async function ProjectsPage() {
  const projects = await getGitHubProjects();
  const groups = groupProjects(projects);

  return (
    <main className="mx-auto min-h-[760px] w-[min(1160px,calc(100%-2rem))] py-28 max-md:py-20">
      <header className="mb-[72px] max-w-[760px]">
        <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">01 — Projects</p>
        <h1 className="my-7 text-[clamp(4rem,10vw,8rem)] font-medium leading-[.95] tracking-[-.09em] max-md:text-[clamp(3rem,15vw,5rem)]">Learning by <em className="font-semibold not-italic text-primary">building.</em></h1>
        <p className="max-w-[440px] text-[1.05rem] leading-6 text-muted-foreground">
          A collection of coding projects I&apos;ve made while learning,
          experimenting, and trying new ideas.
        </p>
      </header>
      {groups.length > 0 ? (
        <div className="grid gap-[92px]">
          {groups.map((group) => (
            <section className="grid gap-7" key={group.title} aria-labelledby={`group-${group.title}`}>
              <div className="flex items-baseline justify-between gap-6 border-border border-b pb-[18px] max-md:flex-col">
                <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">{String(group.projects.length).padStart(2, "0")} projects</p>
                <h2 id={`group-${group.title}`} className="m-0 text-[clamp(1.7rem,3vw,2.6rem)] font-medium tracking-[-.06em]">{group.title}</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                {group.projects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <ProjectsUnavailable />
      )}
      <a className="mt-7 inline-flex items-center gap-2 border border-foreground px-[18px] py-[13px] text-xs font-semibold transition-colors hover:bg-foreground hover:text-background" href={siteConfig.github} target="_blank" rel="noreferrer">
        <Github size={18} aria-hidden="true" /> View GitHub profile
      </a>
    </main>
  );
}
