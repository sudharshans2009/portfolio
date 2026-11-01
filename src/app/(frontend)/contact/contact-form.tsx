"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { submitContact, type ContactState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

const initialState: ContactState = { success: false, message: "" };

export default function ContactForm({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState,
  );

  useEffect(() => {
    if (!state.message) return;
    toast.add({
      type: state.success ? "success" : "error",
      title: state.success ? "Message sent" : "Message not sent",
      description: state.message,
    });
  }, [state]);

  return (
    <form className="grid min-w-0 gap-5 border-border border-b px-0 py-7 pb-10" action={formAction}>
      <Label className="w-full flex-col items-start gap-2">
        Name
        <Input name="name" defaultValue={name} required maxLength={80} autoComplete="name" />
      </Label>
      <Input name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
      <Label className="w-full flex-col items-start gap-2">
        Email
        <Input
          name="email"
          defaultValue={email}
          type="email"
          required
          maxLength={254}
          autoComplete="email"
        />
      </Label>
      <Label className="w-full flex-col items-start gap-2">
        Message
        <Textarea name="body" required minLength={10} maxLength={5000} rows={7} />
      </Label>
      <Button type="submit" disabled={pending} size="lg">
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
