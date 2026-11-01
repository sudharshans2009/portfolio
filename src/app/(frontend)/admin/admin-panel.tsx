"use client";

import { useActionState, useEffect, useState } from "react";
import { OWNER_EMAIL } from "@/lib/admin-constants";
import {
  deleteProject,
  saveProject,
  updateMessage,
  updateUserRole,
  type AdminActionState,
} from "./actions";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type AdminAction = (
  state: AdminActionState,
  formData: FormData,
) => Promise<AdminActionState>;

const initialState: AdminActionState = { success: false, message: "" };

function ActionForm({
  action,
  hidden,
  children,
  submitLabel = "Save",
}: {
  action: AdminAction;
  hidden: Record<string, string>;
  children?: React.ReactNode;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.message) {
      toast.add({
        type: state.success ? "success" : "error",
        title: state.success ? "Updated" : "Action failed",
        description: state.message,
      });
    }
  }, [state]);

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      {Object.entries(hidden).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}
      {children}
      {!children && <Button type="submit" size="sm" disabled={pending}>{pending ? "Saving…" : submitLabel}</Button>}
    </form>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="grid gap-5" aria-labelledby={`${title}-heading`}>
      <div className="flex items-baseline justify-between gap-4 border-border border-b pb-4">
        <h2 id={`${title}-heading`} className="text-2xl font-semibold tracking-[-.04em]">{title}</h2>
        <span className="font-mono text-xs text-muted-foreground">{count} items</span>
      </div>
      {children}
    </section>
  );
}

export default function AdminPanel({
  users,
  activeMessages,
  deletedMessages,
  projects,
}: {
  users: Array<{ id: string; name: string; email: string; role: string; createdAt: Date }>;
  activeMessages: Array<{ id: string; name: string; email: string; body: string; createdAt: Date; read: boolean }>;
  deletedMessages: Array<{ id: string; name: string; email: string; body: string; createdAt: Date; read: boolean; deletedAt: Date | null }>;
  projects: Array<{
    id: string;
    githubName?: string | null;
    name: string;
    description: string | null;
    url: string;
    language: string | null;
    topics: string[];
    featured: boolean;
    visible: boolean;
    isCustom: boolean;
  }>;
}) {
  const [tab, setTab] = useState<"users" | "messages" | "projects">("users");
  const [addingProject, setAddingProject] = useState(false);
  return (
    <div className="grid gap-8">
      <nav className="flex flex-wrap gap-2 border-border border-b pb-3" aria-label="Admin sections">
        {(["users", "messages", "projects"] as const).map((item) => (
          <Button key={item} type="button" variant={tab === item ? "default" : "outline"} onClick={() => setTab(item)}>
            {item[0].toUpperCase() + item.slice(1)}
          </Button>
        ))}
      </nav>

      {tab === "users" && (
        <Section title="Users" count={users.length}>
          <div className="grid gap-3">
            {users.map((item) => (
              <div key={item.id} className="grid gap-4 border border-border p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div className="min-w-0">
                  <p className="font-semibold">{item.name || "Unnamed user"}</p>
                  <p className="break-all text-sm text-muted-foreground">{item.email}</p>
                </div>
                {item.email.toLowerCase() === OWNER_EMAIL ? (
                  <span className="font-mono text-xs uppercase text-primary">Permanent owner</span>
                ) : (
                  <ActionForm
                    action={updateUserRole}
                    hidden={{ userId: item.id, role: item.role === "admin" ? "user" : "admin" }}
                    submitLabel={item.role === "admin" ? "Demote to user" : "Promote to admin"}
                  >
                    <span className="font-mono text-xs uppercase text-muted-foreground">Currently {item.role}</span>
                  </ActionForm>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {tab === "messages" && (
        <div className="grid gap-12">
          <Section title="Messages" count={activeMessages.length}>
            <div className="grid gap-4">
              {activeMessages.map((item) => (
                <article key={item.id} className={`grid gap-4 border p-5 ${item.read ? "border-border" : "border-primary"}`}>
                  <div className="flex flex-wrap justify-between gap-3">
                    <div><p className="font-semibold">{item.name}</p><p className="break-all text-sm text-muted-foreground">{item.email}</p></div>
                    <time className="font-mono text-xs text-muted-foreground">{item.createdAt.toLocaleString()}</time>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-6">{item.body}</p>
                  <div className="flex flex-wrap gap-2">
                    {!item.read && <ActionForm action={updateMessage} hidden={{ id: item.id, action: "read" }} submitLabel="Mark as read" />}
                    <ActionForm action={updateMessage} hidden={{ id: item.id, action: "trash" }}><Button type="submit" size="sm" variant="destructive">Move to deleted</Button></ActionForm>
                  </div>
                </article>
              ))}
            </div>
          </Section>
          <Section title="Deleted messages" count={deletedMessages.length}>
            <div className="grid gap-4">
              {deletedMessages.map((item) => (
                <article key={item.id} className="grid gap-4 border border-border p-5">
                  <div><p className="font-semibold">{item.name}</p><p className="break-all text-sm text-muted-foreground">{item.email}</p></div>
                  <p className="whitespace-pre-wrap text-sm leading-6">{item.body}</p>
                  <div className="flex flex-wrap gap-2">
                    <ActionForm action={updateMessage} hidden={{ id: item.id, action: "restore" }} />
                    <ActionForm action={updateMessage} hidden={{ id: item.id, action: "delete" }}><Button type="submit" size="sm" variant="destructive">Delete permanently</Button></ActionForm>
                  </div>
                </article>
              ))}
            </div>
          </Section>
        </div>
      )}

      {tab === "projects" && (
        <Section title="Projects" count={projects.length}>
          <div className="grid gap-5">
            <Button type="button" variant="outline" className="w-fit" onClick={() => setAddingProject(true)}>
              Add custom project
            </Button>
            {addingProject && (
              <ProjectEditor
                project={{
                  id: "",
                  githubName: null,
                  name: "",
                  description: "",
                  url: "https://",
                  language: "",
                  topics: [],
                  featured: false,
                  visible: true,
                  isCustom: false,
                }}
              />
            )}
            {projects.map((item) => <ProjectEditor key={item.id} project={item} />)}
          </div>
        </Section>
      )}
    </div>
  );
}

function ProjectEditor({ project: item }: { project: {
  id: string; githubName?: string | null; name: string; description: string | null; url: string;
  language: string | null; topics: string[]; featured: boolean; visible: boolean; isCustom: boolean;
} }) {
  const [state, formAction, pending] = useActionState(saveProject, initialState);
  useEffect(() => {
    if (state.message) toast.add({ type: state.success ? "success" : "error", title: state.success ? "Project saved" : "Project not saved", description: state.message });
  }, [state]);
  return (
    <form action={formAction} className="grid gap-4 border border-border p-5">
      <input type="hidden" name="id" value={item.id} />
      {item.githubName && <input type="hidden" name="githubName" value={item.githubName} />}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xs uppercase text-muted-foreground">{item.githubName ? `GitHub · ${item.githubName}` : "Custom project"}</p>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" name="visible" defaultChecked={item.visible} /> Visible</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={item.featured} /> Highlight</label>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="name" defaultValue={item.name} placeholder="Project name" required />
        <Input name="url" defaultValue={item.url} type="url" placeholder="Project URL" required />
        <Input name="language" defaultValue={item.language ?? ""} placeholder="Language" />
        <Input name="topics" defaultValue={item.topics.join(", ")} placeholder="Topics, comma separated" />
      </div>
      <Textarea name="description" defaultValue={item.description ?? ""} placeholder="Description" rows={3} />
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save project"}</Button>
        {item.isCustom && <ActionForm action={deleteProject} hidden={{ id: item.id }}><Button type="submit" variant="destructive">Delete project</Button></ActionForm>}
      </div>
    </form>
  );
}
