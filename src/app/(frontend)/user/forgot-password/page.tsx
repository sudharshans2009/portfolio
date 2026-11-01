"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const result = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/user/reset-password`,
    });
    setPending(false);
    if (result.error) {
      toast.add({
        type: "error",
        title: "Reset email failed",
        description: result.error.message || "The reset email could not be sent.",
      });
      return;
    }
    toast.add({
      type: "success",
      title: "Check your email",
      description: "If an account exists for that address, a reset link is on its way.",
    });
  }

  return (
    <main className="mx-auto grid min-h-[760px] w-[min(1160px,calc(100%-2rem))] place-items-center py-24">
      <Card className="w-full max-w-[430px] p-9">
        <CardHeader>
          <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">Account recovery</p>
          <CardTitle>Reset your password</CardTitle>
          <p className="text-sm text-muted-foreground">Enter your email and we&apos;ll send you a secure reset link.</p>
        </CardHeader>
        <CardContent>
          <form className="grid gap-5" onSubmit={submit}>
            <Label className="w-full flex-col items-start gap-2">
              Email
              <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
            </Label>
            <Button type="submit" disabled={pending}>{pending ? "Sending…" : "Send reset email"}</Button>
            <Link className="text-center text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground" href="/user/sign-in">Back to login</Link>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
