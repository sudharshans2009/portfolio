"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { ManagedProject } from "@/lib/managed-projects";
import { useManagedProjects } from "@/components/project-query";

export default function AboutProjectSummary({
  initialProjects,
}: {
  initialProjects: ManagedProject[];
}) {
  const { data: projects } = useManagedProjects(initialProjects);
  const languages = new Set(
    projects
      .map((project) => project.language)
      .filter((language): language is string => Boolean(language)),
  );

  return (
    <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
      {[
        ["Active projects", projects.length],
        ["Languages used", languages.size],
        ["Projects listed", projects.length],
      ].map(([label, value]) => (
        <Card key={label} className="bg-muted/20 p-0 shadow-none">
          <CardContent className="p-6">
            <p className="font-mono text-[.68rem] uppercase tracking-[.08em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-5 text-5xl font-semibold tracking-[-.08em] text-primary">
              {value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
