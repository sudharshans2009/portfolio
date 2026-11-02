"use client";

import { Github } from "lucide-react";
import { groupProjects } from "@/lib/github";
import type { ManagedProject } from "@/lib/managed-projects";
import { siteConfig } from "@/lib/site-config";
import ProjectCard from "@/components/project-card";
import { useManagedProjects } from "@/components/project-query";

export default function ProjectGroups({
  initialProjects,
}: {
  initialProjects: ManagedProject[];
}) {
  const { data: projects } = useManagedProjects(initialProjects);
  const groups = groupProjects(projects);
  const groupedIds = new Set(
    groups.flatMap((group) => group.projects.map((project) => project.id)),
  );
  const ungrouped = projects.filter((project) => !groupedIds.has(project.id));
  const allGroups =
    ungrouped.length > 0
      ? [...groups, { title: "Other projects", projects: ungrouped }]
      : groups;

  return (
    <>
      {allGroups.length > 0 ? (
        <div className="grid gap-[92px]">
          {allGroups.map((group) => (
            <section
              className="grid gap-7"
              key={group.title}
              aria-labelledby={`group-${group.title}`}
            >
              <div className="flex items-baseline justify-between gap-6 border-border border-b pb-[18px] max-md:flex-col">
                <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">
                  {String(group.projects.length).padStart(2, "0")} projects
                </p>
                <h2
                  id={`group-${group.title}`}
                  className="m-0 text-[clamp(1.7rem,3vw,2.6rem)] font-medium tracking-[-.06em]"
                >
                  {group.title}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                {group.projects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="border-border border-y py-8 text-muted-foreground">
          No projects are available right now.
        </p>
      )}
      <a
        className="mt-7 inline-flex items-center gap-2 border border-foreground px-[18px] py-[13px] text-xs font-semibold transition-colors hover:bg-foreground hover:text-background"
        href={siteConfig.github}
        target="_blank"
        rel="noreferrer"
      >
        <Github size={18} aria-hidden="true" /> View GitHub profile
      </a>
    </>
  );
}
