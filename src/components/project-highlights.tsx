"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { ManagedProject } from "@/lib/managed-projects";
import { useManagedProjects } from "@/components/project-query";

export default function ProjectHighlights({
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
    <div className="grid gap-4 sm:grid-cols-3">
      {[
        ["Active projects", projects.length],
        ["Languages used", languages.size],
      ].map(([label, value]) => (
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
      <Card className="bg-muted/20 p-0 shadow-none">
        <CardContent className="p-6">
          <p className="font-mono text-[.68rem] uppercase tracking-[.08em] text-muted-foreground">
            Based in
          </p>
          <p className="mt-6 text-4xl font-semibold tracking-[-.07em] text-primary">
            India
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
