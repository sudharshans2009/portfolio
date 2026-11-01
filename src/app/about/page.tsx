import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { generateMetadata } from "@/lib/metadata";
import { getManagedProjects } from "@/lib/managed-projects";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AboutProjectSummary from "@/components/about-project-summary";

export const metadata = generateMetadata(
  "About - SS.me",
  "About Sudharshan S, a student at Amrita Vidyalayam, Coimbatore, who builds coding projects.",
  "/about",
);
export const dynamic = "force-static";
export const revalidate = 3600;

const learningGroups = [
  {
    label: "Hobby languages",
    description: "The languages I use to explore ideas and build projects.",
    items: ["TypeScript", "JavaScript"],
  },
  {
    label: "Computer science",
    description: "The languages and tools I use for CS class.",
    items: ["Python", "MySQL / SQL"],
  },
  {
    label: "Technologies explored",
    description: "Tools I have worked with across different projects.",
    items: ["React", "Next.js", "Node.js", "Tailwind CSS", "PostgreSQL", "Git"],
  },
] as const;

export default async function AboutPage() {
  const projects = await getManagedProjects();

  return (
    <main className="mx-auto min-h-[760px] w-[min(1160px,calc(100%-2rem))] py-28 max-md:py-20">
      <header className="mb-[72px] max-w-[760px]">
        <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">02 - About</p>
        <h1 className="my-7 text-[clamp(4rem,10vw,8rem)] font-medium leading-[.95] tracking-[-.09em] max-md:text-[clamp(3rem,15vw,5rem)]">A student who <em className="font-semibold not-italic text-primary">builds.</em></h1>
      </header>
      <div className="ml-[33.333%] max-w-[650px] space-y-6 text-[1.15rem] leading-7 text-muted-foreground max-md:ml-0">
        <p>
          I&apos;m Sudharshan S, a student at Amrita Vidyalayam in Coimbatore.
          I learn best by making things, so this site is a home for the
          projects I build while exploring software.
        </p>
        <p>
          TypeScript and JavaScript are the languages I use as hobbies. I also
          work with Python and MySQL for my computer science classes.
        </p>
        <p>
          I enjoy turning ideas into useful interfaces, APIs, and small
          experiments. Each project gives me a way to practise what I know,
          learn something new, and share the result.
        </p>
        <p>
          I&apos;m still learning, and that is the point. Every project is a
          chance to understand something better and take the next step.
        </p>
        <Link className="inline-flex items-center gap-2 bg-primary px-5 py-4 text-sm font-bold text-primary-foreground" href="/contact">
          Get in touch <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>

      <section className="mt-32 border-t border-border pt-10 max-md:mt-24" aria-labelledby="how-i-work-heading">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_2fr]">
          <div>
            <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">03 - How I work</p>
            <h2 id="how-i-work-heading" className="mt-5 max-w-[360px] text-[clamp(2.2rem,5vw,4.5rem)] font-medium leading-[.95] tracking-[-.07em]">
              Learning by <em className="font-semibold not-italic text-primary">making.</em>
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {learningGroups.map((group) => (
              <Card key={group.label} className="bg-muted/20 p-0 shadow-none">
                <CardHeader className="border-b p-5">
                  <CardTitle className="text-sm">{group.label}</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <p className="min-h-12 text-xs leading-5 text-muted-foreground">{group.description}</p>
                  <Separator className="my-4" />
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <Badge key={item} variant="outline" className="rounded-none font-mono text-[.62rem] uppercase">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-24 grid gap-8 border-t border-border pt-10 md:grid-cols-[minmax(0,1fr)_2fr] max-md:mt-16" aria-labelledby="currently-learning-heading">
        <div>
          <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">04 - Currently learning</p>
          <h2 id="currently-learning-heading" className="mt-5 max-w-[360px] text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[.95] tracking-[-.07em]">
            Keep moving <em className="font-semibold not-italic text-primary">forward.</em>
          </h2>
        </div>
        <Card className="bg-primary p-0 text-primary-foreground shadow-none">
          <CardContent className="grid gap-8 p-7 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-[560px] text-xl leading-8">
              I&apos;m building full-stack projects, improving my TypeScript and
              JavaScript, and using Python and SQL through computer science
              class.
            </p>
            <div className="font-mono text-[.68rem] uppercase tracking-[.08em] text-primary-foreground/70">
              Always learning
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-24 border-t border-border pt-10 max-md:mt-16" aria-labelledby="project-summary-heading">
        <div className="mb-7 flex items-end justify-between gap-6 max-md:flex-col max-md:items-start">
          <div>
            <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">05 - Project summary</p>
            <h2 id="project-summary-heading" className="mt-5 text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[.95] tracking-[-.07em]">
              A living <em className="font-semibold not-italic text-primary">workbench.</em>
            </h2>
          </div>
          <p className="max-w-[300px] text-sm leading-6 text-muted-foreground">
            These numbers are generated from my public GitHub repositories.
          </p>
        </div>
        <AboutProjectSummary initialProjects={projects} />
      </section>
    </main>
  );
}
