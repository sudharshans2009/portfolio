"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { ManagedProject } from "@/lib/managed-projects";
import { useManagedProjects } from "@/components/project-query";
import { groupProjects } from "@/lib/github";

export default function ProjectHighlights({
  initialProjects,
}: {
  initialProjects: ManagedProject[];
}) {
  const { data: projects } = useManagedProjects(initialProjects);

  // Only count projects that are actually listed on the Projects page
  const listed = Array.from(
    new Map(
      groupProjects(projects)
        .flatMap((group) => group.projects)
        .map((project) => [project.id, project]),
    ).values(),
  );

  const languages = new Set(
    listed
      .map((project) => project.language)
      .filter((language): language is string => Boolean(language)),
  );

  const stats = [
    ["Projects built", listed.length],
    ["Languages used", languages.size],
    ["Based in", "India"],
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map(([label, value]) => (
        <Card key={label} className="bg-muted/20 p-0 shadow-none">
          <CardContent className="p-6">
            <p className="font-mono text-[.68rem] uppercase tracking-[.08em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-6 text-4xl font-semibold tracking-[-.07em] text-primary">
              {value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}