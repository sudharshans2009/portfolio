"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { OWNER_EMAIL } from "@/lib/admin-constants";
import {
  deleteProject,
  deleteUser,
  saveProject,
  updateUser,
  updateMessage,
  type AdminActionState,
} from "./actions";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "cn";
import DataTable, { type DataTableColumn } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  variant = "default",
  className,
}: {
  action: AdminAction;
  hidden: Record<string, string>;
  children?: React.ReactNode;
  submitLabel?: string;
  variant?: "default" | "destructive";
  className?: string;
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
    <form action={formAction} className={cn("flex flex-wrap items-center gap-2", className)}>
      {Object.entries(hidden).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}
      {children}
      <Button type="submit" size="sm" variant={variant} disabled={pending}>{pending ? "Saving…" : submitLabel}</Button>
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
  projects,
}: {
  users: Array<{ id: string; name: string; email: string; role: string; createdAt: Date }>;
  activeMessages: Array<{ id: string; name: string; email: string; body: string; createdAt: Date; read: boolean }>;
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
          <UserTable users={users} />
        </Section>
      )}

      {tab === "messages" && (
        <div className="grid gap-12">
          <Section title="Messages" count={activeMessages.length}>
            <div className="grid gap-4">
              {activeMessages.length > 0 ? activeMessages.map((item) => (
                <article key={item.id} className={`grid gap-4 border p-5 ${item.read ? "border-border" : "border-primary"}`}>
                  <div className="flex flex-wrap justify-between gap-3">
                    <div><p className="font-semibold">{item.name}</p><p className="break-all text-sm text-muted-foreground">{item.email}</p></div>
                    <time className="font-mono text-xs text-muted-foreground">{item.createdAt.toLocaleString()}</time>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-6">{item.body}</p>
                  <div className="flex flex-wrap gap-2">
                    {!item.read && <ActionForm action={updateMessage} hidden={{ id: item.id, action: "read" }} submitLabel="Mark as read" />}
                    <ActionForm action={updateMessage} hidden={{ id: item.id, action: "trash" }} submitLabel="Move to deleted" variant="destructive" />
                  </div>
                </article>
              )) : <p className="text-sm text-muted-foreground">No messages found.</p>}
            </div>
          </Section>
          <Link href="/admin/messages/deleted" className="inline-flex w-fit items-center border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
            View deleted messages
          </Link>
        </div>
      )}

      {tab === "projects" && (
        <Section title="Projects" count={projects.length}>
          <ProjectTable projects={projects} />
        </Section>
      )}
    </div>
  );
}

function UserTable({ users }: { users: Array<{ id: string; name: string; email: string; role: string; createdAt: Date }> }) {
  const columns: DataTableColumn<typeof users[number]>[] = [
    { header: "User", cell: (item) => <span className="font-medium">{item.name || "Unnamed user"}</span>, searchable: (item) => `${item.name} ${item.email}` },
    { header: "Email", cell: (item) => <span className="break-all text-muted-foreground">{item.email}</span>, searchable: (item) => item.email },
    { header: "Role", cell: (item) => <span className="font-mono text-xs uppercase">{item.role}</span>, searchable: (item) => item.role },
    {
      header: "Actions",
      cell: (item) => item.email.toLowerCase() === OWNER_EMAIL
        ? <span className="font-mono text-xs uppercase text-primary">Permanent owner</span>
        : <UserActionsDialog user={item} />,
    },
  ];
  return <DataTable data={users} columns={columns} emptyMessage="No users found." placeholder="Search users…" />;
}

function UserActionsDialog({ user }: { user: { id: string; name: string; email: string; role: string } }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(updateUser, initialState);
  const [deleteState, deleteFormAction, deletePending] = useActionState(deleteUser, initialState);
  useEffect(() => {
    if (state.success || deleteState.success) setOpen(false);
    if (state.message) toast.add({ type: state.success ? "success" : "error", title: state.success ? "User updated" : "Update failed", description: state.message });
    if (deleteState.message) toast.add({ type: deleteState.success ? "success" : "error", title: deleteState.success ? "User deleted" : "Delete failed", description: deleteState.message });
  }, [deleteState, state]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button type="button" size="sm" variant="outline" onClick={() => setOpen(true)}>Manage</Button>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage user</DialogTitle>
          <DialogDescription>{user.name || user.email}</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4">
          <input type="hidden" name="id" value={user.id} />
          <Label className="w-full flex-col items-start gap-2">Name<Input name="name" defaultValue={user.name} required /></Label>
          <Label className="w-full flex-col items-start gap-2">Email<Input name="email" type="email" defaultValue={user.email} required /></Label>
          <Label className="w-full flex-col items-start gap-2">Role
            <select name="role" defaultValue={user.role} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </Label>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save changes"}</Button>
          </DialogFooter>
        </form>
        <form action={deleteFormAction} className="border-t border-border pt-4">
          <input type="hidden" name="id" value={user.id} />
          <Button type="submit" variant="destructive" disabled={deletePending}>{deletePending ? "Deleting…" : "Delete user"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ProjectTable({ projects }: { projects: Array<{
  id: string; githubName?: string | null; name: string; description: string | null; url: string;
  language: string | null; topics: string[]; featured: boolean; visible: boolean; isCustom: boolean;
}> }) {
  const columns: DataTableColumn<typeof projects[number]>[] = [
    { header: "Project", cell: (item) => <span className="font-medium">{item.name}</span>, searchable: (item) => `${item.name} ${item.githubName || ""}` },
    { header: "Language", cell: (item) => item.language || "-", searchable: (item) => item.language || "" },
    { header: "Status", cell: (item) => <span className="font-mono text-xs uppercase">{item.visible ? "Visible" : "Hidden"}{item.featured ? " · Featured" : ""}</span>, searchable: (item) => `${item.visible} ${item.featured}` },
    { header: "Actions", cell: (item) => <ProjectDialog project={item} /> },
  ];
  return (
    <div className="grid gap-3">
      <ProjectDialog />
      <DataTable data={projects} columns={columns} emptyMessage="No projects found." placeholder="Search projects…" />
    </div>
  );
}

function ProjectDialog({ project: item }: { project?: {
  id: string; githubName?: string | null; name: string; description: string | null; url: string;
  language: string | null; topics: string[]; featured: boolean; visible: boolean; isCustom: boolean;
} }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(saveProject, initialState);
  useEffect(() => {
    if (state.message) toast.add({ type: state.success ? "success" : "error", title: state.success ? "Project saved" : "Project not saved", description: state.message });
    if (state.success) setOpen(false);
  }, [state]);
  const project = item || { id: "", githubName: null, name: "", description: "", url: "https://", language: "", topics: [], featured: false, visible: true, isCustom: false };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button type="button" size="sm" variant={item ? "outline" : "default"} onClick={() => setOpen(true)}>{item ? "Edit" : "Add project"}</Button>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? "Edit project" : "Add project"}</DialogTitle>
          <DialogDescription>{item?.githubName ? `GitHub · ${item.githubName}` : "Project details and visibility."}</DialogDescription>
        </DialogHeader>
        <form id={`project-form-${project.id || "new"}`} action={formAction} className="grid gap-4">
          <input type="hidden" name="id" value={project.id} />
          {project.githubName && <input type="hidden" name="githubName" value={project.githubName} />}
          <div className="grid gap-4 md:grid-cols-2">
            <Label className="w-full flex-col items-start gap-2">Name<Input name="name" defaultValue={project.name} required /></Label>
            <Label className="w-full flex-col items-start gap-2">URL<Input name="url" defaultValue={project.url} type="url" required /></Label>
            <Label className="w-full flex-col items-start gap-2">Language<Input name="language" defaultValue={project.language ?? ""} /></Label>
            <Label className="w-full flex-col items-start gap-2">Topics<Input name="topics" defaultValue={project.topics.join(", ")} /></Label>
          </div>
          <Label className="w-full flex-col items-start gap-2">Description<Textarea name="description" defaultValue={project.description ?? ""} rows={3} /></Label>
          <div className="flex flex-wrap gap-4 text-sm">
            <Label className="flex items-center gap-2"><Checkbox name="visible" defaultChecked={project.visible} value="on" />Visible</Label>
            <Label className="flex items-center gap-2"><Checkbox name="featured" defaultChecked={project.featured} value="on" />Highlight</Label>
          </div>
        </form>
        <DialogFooter className="flex-row items-center justify-between">
          {item ? (
            <ActionForm
              action={deleteProject}
              className="mr-auto"
              hidden={{
                id: project.id,
                ...(project.githubName ? {
                  githubName: project.githubName,
                  name: project.name,
                  description: project.description ?? "",
                  url: project.url,
                  language: project.language ?? "",
                } : {}),
              }}
              submitLabel="Delete project"
              variant="destructive"
            />
          ) : <span />}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form={`project-form-${project.id || "new"}`} disabled={pending}>{pending ? "Saving…" : "Save project"}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
