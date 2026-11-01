import { ArrowUpRight } from "lucide-react";
import type { GitHubProject } from "@/lib/github";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default function ProjectCard({
  project,
  index,
}: {
  project: GitHubProject;
  index: number;
}) {
  return (
    <Card className="group flex min-h-[330px] flex-col justify-between bg-background p-0 transition-colors hover:bg-muted/70 max-md:min-h-[280px]">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b p-6 font-mono text-[.68rem] uppercase tracking-[.08em] text-muted-foreground max-md:p-4">
        <span className="text-primary">{String(index + 1).padStart(2, "0")} / project</span>
        {project.language && <span>{project.language}</span>}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center p-6 max-md:p-4">
        <CardTitle className="text-[clamp(1.5rem,2.4vw,2.1rem)] font-semibold capitalize tracking-[-.05em]">
          {project.name.replaceAll("-", " ")}
        </CardTitle>
        <p className="mt-3 max-w-[420px] text-sm leading-6 text-muted-foreground">
          {project.description || "A coding project from my open-source lab."}
        </p>
      </CardContent>
      <CardFooter className="flex min-h-16 items-center justify-between gap-4 border-t bg-transparent p-6 max-md:p-4">
        <div className="flex min-w-0 flex-wrap gap-1.5" aria-label="Technologies">
          {project.topics.length > 0
            ? project.topics.slice(0, 3).map((topic) => (
                <Badge key={topic} className="rounded-none font-mono text-[.62rem] uppercase" variant="outline">{topic}</Badge>
              ))
            : <span className="font-mono text-[.68rem] uppercase text-muted-foreground">Open source</span>}
        </div>
        <a className={buttonVariants({ variant: "link", size: "sm", className: "ml-auto gap-2 px-0 text-foreground group-hover:text-primary" })}
          href={project.html_url}
          target="_blank"
          rel="noreferrer"
          aria-label={`View ${project.name} on GitHub`}
        >
          View <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={16} aria-hidden="true" />
        </a>
      </CardFooter>
    </Card>
  );
}
