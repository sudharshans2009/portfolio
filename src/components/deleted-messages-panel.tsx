"use client";

import { useActionState, useEffect } from "react";
import { updateMessage, type AdminActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

const initialState: AdminActionState = { success: false, message: "" };

function MessageAction({
  id,
  action,
  label,
  variant = "default",
}: {
  id: string;
  action: "restore" | "delete";
  label: string;
  variant?: "default" | "destructive";
}) {
  const [state, formAction, pending] = useActionState(
    updateMessage,
    initialState,
  );

  useEffect(() => {
    if (state.message) {
      toast.add({
        type: state.success ? "success" : "error",
        title: state.success ? "Message updated" : "Action failed",
        description: state.message,
      });
    }
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="action" value={action} />
      <Button type="submit" size="sm" variant={variant} disabled={pending}>
        {pending ? "Saving…" : label}
      </Button>
    </form>
  );
}

export default function DeletedMessagesPanel({
  messages,
}: {
  messages: Array<{
    id: string;
    name: string;
    email: string;
    body: string;
    createdAt: Date;
    read: boolean;
    deletedAt: Date | null;
  }>;
}) {
  if (messages.length === 0) {
    return (
      <p className="border-y border-border py-8 text-muted-foreground">
        No deleted messages.
      </p>
    );
  }

  return (
    <section className="grid gap-4" aria-labelledby="deleted-messages-heading">
      <div className="flex items-baseline justify-between gap-4 border-b border-border pb-4">
        <h2
          id="deleted-messages-heading"
          className="text-2xl font-semibold tracking-[-.04em]"
        >
          Deleted messages
        </h2>
        <span className="font-mono text-xs text-muted-foreground">
          {messages.length} items
        </span>
      </div>
      {messages.map((item) => (
        <article key={item.id} className="grid gap-4 border border-border p-5">
          <div className="flex flex-wrap justify-between gap-3">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="break-all text-sm text-muted-foreground">
                {item.email}
              </p>
            </div>
            <time className="font-mono text-xs text-muted-foreground">
              {item.createdAt.toLocaleString()}
            </time>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-6">{item.body}</p>
          <div className="flex flex-wrap gap-2">
            <MessageAction id={item.id} action="restore" label="Restore" />
            <MessageAction
              id={item.id}
              action="delete"
              label="Delete permanently"
              variant="destructive"
            />
          </div>
        </article>
      ))}
    </section>
  );
}
