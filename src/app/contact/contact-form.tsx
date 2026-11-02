"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { submitContact, type ContactState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { contactSchema, type ContactFormValues } from "./schema";

const initialState: ContactState = { success: false, message: "" };

export default function ContactForm() {
  const { data: session } = authClient.useSession();
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState,
  );
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", body: "", website: "" },
  });

  useEffect(() => {
    if (!session?.user) return;

    const profileName = session.user.name.trim();
    if (!form.getValues("name") && profileName) {
      form.setValue("name", profileName, { shouldValidate: true });
    }
    if (!form.getValues("email") && session.user.email) {
      form.setValue("email", session.user.email, { shouldValidate: true });
    }
  }, [form, session?.user]);

  useEffect(() => {
    if (!state.message) return;
    toast.add({
      type: state.success ? "success" : "error",
      title: state.success ? "Message sent" : "Message not sent",
      description: state.message,
    });
  }, [state]);

  function onSubmit(values: ContactFormValues) {
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("email", values.email);
    formData.set("body", values.body);
    formData.set("website", values.website || "");
    formAction(formData);
  }

  return (
    <Form {...form}>
      <form
        className="grid min-w-0 max-w-full gap-5 overflow-hidden border-border border-b px-0 py-7 pb-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="min-w-0">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full min-w-0"
                  maxLength={80}
                  autoComplete="name"
                />
              </FormControl>
              <FormMessage name="name" />
            </FormItem>
          )}
        />
        <Input
          {...form.register("website")}
          tabIndex={-1}
          autoComplete="off"
          className="w-0 sr-only"
          aria-hidden="true"
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="min-w-0">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full min-w-0"
                  type="email"
                  maxLength={254}
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage name="email" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem className="min-w-0">
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="w-full min-w-0 max-w-full"
                  maxLength={5000}
                  rows={7}
                />
              </FormControl>
              <FormMessage name="body" />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending} size="lg">
          {pending ? "Sending…" : "Send message"}
        </Button>
      </form>
    </Form>
  );
}
