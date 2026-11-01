"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ManagedProject } from "@/lib/managed-projects";
import ProjectCard from "@/components/project-card";
import { useManagedProjects } from "@/components/project-query";

export default function FeaturedProjects({
  initialProjects,
}: {
  initialProjects: ManagedProject[];
}) {
  const { data: projects } = useManagedProjects(initialProjects);
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <>
      {featuredProjects.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          {featuredProjects.slice(0, 4).map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      ) : (
        <p className="border-border border-y py-8 text-muted-foreground">
          Selected projects will appear here when they are highlighted.
        </p>
      )}
      <Link
        className="mt-7 inline-flex items-center gap-2 border border-foreground px-[18px] py-[13px] text-xs font-semibold transition-colors hover:bg-foreground hover:text-background"
        href="/projects"
      >
        See all projects <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </>
  );
}
