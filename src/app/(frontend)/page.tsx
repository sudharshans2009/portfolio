import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { getManagedProjects } from "@/lib/managed-projects";
import { generateMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import ProjectCard from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = generateMetadata(
  siteConfig.title,
  siteConfig.description,
  "/",
);

export default async function HomePage() {
  const projects = (await getManagedProjects()).filter(
    (project) => !project.fork && !project.archived,
  );
  const featuredProjects = projects.filter((project) => project.featured);
  const languages = [...new Set(
    projects
      .map((project) => project.language)
      .filter((language): language is string => Boolean(language)),
  )];

  return (
    <main>
      <section className="mx-auto flex min-h-[680px] w-[min(1160px,calc(100%-2rem))] flex-col justify-center py-24 max-md:min-h-[590px] max-md:py-20">
        <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">Independent developer · {siteConfig.location}</p>
        <h1 className="my-7 mb-11 max-w-[1000px] text-[clamp(4rem,11vw,9.5rem)] font-medium leading-[.95] tracking-[-.09em] max-md:text-[clamp(3rem,15vw,5rem)]">
          Coding projects,
          <br />
          <em className="font-semibold not-italic text-primary">carefully made.</em>
        </h1>
        <div className="flex items-end justify-between gap-8 border-border border-t pt-6 max-md:flex-col max-md:items-start">
          <p className="m-0 max-w-[440px] text-[1.05rem] leading-6 text-muted-foreground">{siteConfig.positioning}</p>
          <Link className="inline-flex items-center gap-2 border-foreground border-b pb-1 text-sm font-semibold" href="#work">
            Explore selected work <ArrowDownRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section id="work" className="mx-auto w-[min(1160px,calc(100%-2rem))] py-32 max-md:py-20" aria-labelledby="work-heading">
        <div className="mb-13 flex flex-col items-start gap-[18px]">
          <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">01 — Selected work</p>
          <h2 id="work-heading" className="m-0 text-[clamp(2.2rem,5vw,4.5rem)] font-medium leading-[.95] tracking-[-.07em]">Things I&apos;ve been building.</h2>
          <p className="m-0 text-muted-foreground">Projects pulled from my public GitHub work, so this list stays current.</p>
        </div>
        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            {featuredProjects.slice(0, 4).map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <p className="border-border border-y py-8 text-muted-foreground">Selected projects will appear here when they are highlighted.</p>
        )}
        <Link className="mt-7 inline-flex items-center gap-2 border border-foreground px-[18px] py-[13px] text-xs font-semibold transition-colors hover:bg-foreground hover:text-background" href="/projects">
          See all projects <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </section>

      <section className="mx-auto w-[min(1160px,calc(100%-2rem))] border-t border-border py-28 max-md:py-20" aria-labelledby="snapshot-heading">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_2fr]">
          <div>
            <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">02 — A small snapshot</p>
            <h2 id="snapshot-heading" className="mt-6 max-w-[390px] text-[clamp(2.4rem,5vw,4.5rem)] font-medium leading-[.95] tracking-[-.07em]">
              Curious, practical, <em className="font-semibold not-italic text-primary">always learning.</em>
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Active projects", projects.length],
              ["Languages used", languages.length],
              ["Based in", siteConfig.location],
            ].map(([label, value]) => (
              <Card key={label} className="bg-muted/20 p-0 shadow-none">
                <CardContent className="p-6">
                  <p className="font-mono text-[.68rem] uppercase tracking-[.08em] text-muted-foreground">{label}</p>
                  <p className="mt-6 text-4xl font-semibold tracking-[-.07em] text-primary">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Card className="mt-4 bg-primary p-0 text-primary-foreground shadow-none">
          <CardContent className="grid gap-6 p-7 md:grid-cols-[1fr_auto] md:items-center">
            <p className="max-w-[680px] text-lg leading-7">
              I learn by turning questions into small projects, then improving
              them until the idea becomes something useful.
            </p>
            <span className="font-mono text-[.68rem] uppercase tracking-[.08em] text-primary-foreground/70">Student developer</span>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto w-[min(1160px,calc(100%-2rem))] border-t border-border py-28 max-md:py-20" aria-labelledby="process-heading">
        <div className="mb-10 flex items-end justify-between gap-6 max-md:flex-col max-md:items-start">
          <div>
            <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">03 — How I build</p>
            <h2 id="process-heading" className="mt-6 text-[clamp(2.4rem,5vw,4.5rem)] font-medium leading-[.95] tracking-[-.07em]">
              From idea to <em className="font-semibold not-italic text-primary">working project.</em>
            </h2>
          </div>
          <p className="max-w-[300px] text-sm leading-6 text-muted-foreground">
            My projects are where I practise, experiment, and learn in public.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["01", "Start small", "I turn an idea into a focused first version that I can understand and improve."],
            ["02", "Make it useful", "I care about clear interfaces, reliable behavior, and solving a real problem."],
            ["03", "Keep learning", "Every project gives me something new to explore, from APIs to databases."],
          ].map(([number, title, description]) => (
            <Card key={number} className="bg-muted/20 p-0 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between border-b p-6">
                <CardTitle className="text-base">{title}</CardTitle>
                <span className="font-mono text-[.68rem] text-primary">{number}</span>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm leading-6 text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <span className="font-mono text-[.68rem] uppercase tracking-[.08em] text-muted-foreground">Working with</span>
          <Separator orientation="vertical" className="hidden h-4 sm:block" />
          {["TypeScript", "JavaScript", "Python", "MySQL / SQL"].map((item) => (
            <Badge key={item} variant="outline" className="rounded-none font-mono text-[.62rem] uppercase">{item}</Badge>
          ))}
        </div>
      </section>

      <section className="mx-auto w-[min(1160px,calc(100%-2rem))] border-t border-border py-36 max-md:py-24" aria-labelledby="contact-heading">
        <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">02 — Start a conversation</p>
        <h2 id="contact-heading" className="my-7 mb-11 max-w-[680px] text-[clamp(2.2rem,5vw,4.5rem)] font-medium leading-[.95] tracking-[-.07em]">Want to talk code?</h2>
        <Link className="inline-flex items-center gap-2 bg-primary px-5 py-4 text-sm font-bold text-primary-foreground" href="/contact">Say hello <ArrowUpRight size={20} aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
