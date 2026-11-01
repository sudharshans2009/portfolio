import { generateMetadata } from "@/lib/metadata";
import { getManagedProjects } from "@/lib/managed-projects";
import ProjectGroups from "@/components/project-groups";

export const metadata = generateMetadata(
  "Projects - SS.me",
  "Coding projects by Sudharshan S, built with TypeScript, JavaScript, and Python.",
  "/projects",
);
export const dynamic = "force-static";
export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getManagedProjects();

  return (
    <main className="mx-auto min-h-[760px] w-[min(1160px,calc(100%-2rem))] py-28 max-md:py-20">
      <header className="mb-[72px] max-w-[760px]">
        <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">01 - Projects</p>
        <h1 className="my-7 text-[clamp(4rem,10vw,8rem)] font-medium leading-[.95] tracking-[-.09em] max-md:text-[clamp(3rem,15vw,5rem)]">Learning by <em className="font-semibold not-italic text-primary">building.</em></h1>
        <p className="max-w-[440px] text-[1.05rem] leading-6 text-muted-foreground">
          A collection of coding projects I&apos;ve made while learning,
          experimenting, and trying new ideas.
        </p>
      </header>
      <ProjectGroups initialProjects={projects} />
    </main>
  );
}
