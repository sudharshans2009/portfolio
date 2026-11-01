"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const result = await authClient.resetPassword({ newPassword: password, token });
    setPending(false);
    if (result.error) {
      toast.add({
        type: "error",
        title: "Password reset failed",
        description: result.error.message || "This reset link may have expired.",
      });
      return;
    }

    toast.add({
      type: "success",
      title: "Password reset",
      description: "Your password has been updated. You can now log in.",
    });
    setPassword("");
  }

  return (
    <main className="mx-auto grid min-h-[760px] w-[min(1160px,calc(100%-2rem))] place-items-center py-24">
      <Card className="w-full max-w-[430px] p-9">
        <CardHeader>
          <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">Account recovery</p>
          <CardTitle>Choose a new password</CardTitle>
        </CardHeader>
        <CardContent>
          {!token ? (
            <div className="grid gap-4 text-sm text-muted-foreground">
              <p>This reset link is missing or invalid.</p>
              <Link className="text-foreground underline underline-offset-4" href="/user/forgot-password">Request a new link</Link>
            </div>
          ) : (
            <form className="grid gap-5" onSubmit={submit}>
              <Label className="w-full flex-col items-start gap-2">
                New password
                <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete="new-password" />
              </Label>
              <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Set new password"}</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
