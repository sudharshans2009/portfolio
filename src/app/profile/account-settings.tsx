"use client";

import { KeyRound, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";

export default function AccountSettings({
  email,
  createdAt,
}: {
  email: string;
  createdAt?: Date | string;
}) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [pending, setPending] = useState(false);

  async function signOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const result = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    setPending(false);
    if (result.error) {
      toast.add({
        type: "error",
        title: "Password change failed",
        description:
          result.error.message || "Your password could not be changed.",
      });
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    toast.add({
      type: "success",
      title: "Password changed",
      description:
        "Your password has been updated and other sessions were signed out.",
    });
  }

  async function changeEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const result = await authClient.changeEmail({
      newEmail: newEmail.trim(),
      callbackURL: "/profile",
    });
    setPending(false);

    if (result.error) {
      toast.add({
        type: "error",
        title: "Email change failed",
        description: result.error.message || "Your email could not be changed.",
      });
      return;
    }

    setNewEmail("");
    toast.add({
      type: "success",
      title: "Confirm your new email",
      description: "We sent a confirmation link to your new email address.",
    });
  }

  const joinedDate = createdAt
    ? new Intl.DateTimeFormat("en-IN", {
        month: "long",
        year: "numeric",
      }).format(new Date(createdAt))
    : "Recently";

  return (
    <div className="grid gap-5">
      <Card className="bg-muted/20 p-0 shadow-none">
        <CardHeader className="border-b p-6">
          <div className="flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center border border-border bg-background text-primary">
              <UserRound size={17} aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base">Account details</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Your login and account information.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 p-6">
          <div className="flex items-center justify-between gap-5 text-sm">
            <span className="text-muted-foreground">Email</span>
            <span className="max-w-[65%] truncate font-medium">{email}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-5 text-sm">
            <span className="text-muted-foreground">Member since</span>
            <span className="font-medium">{joinedDate}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[.65rem] uppercase tracking-[.08em] text-green-700 dark:text-green-400">
            <ShieldCheck size={14} aria-hidden="true" />
            Account secured
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/20 p-0 shadow-none">
        <CardHeader className="border-b p-6">
          <div className="flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center border border-border bg-background text-primary">
              <KeyRound size={17} aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base">Password</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Change your password and protect your account.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form className="grid gap-4" onSubmit={changePassword}>
            <Label className="w-full flex-col items-start gap-2">
              Current password
              <Input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
                autoComplete="current-password"
              />
            </Label>
            <Label className="w-full flex-col items-start gap-2">
              New password
              <Input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </Label>
            <Button type="submit" disabled={pending}>
              {pending ? "Updating…" : "Change password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-muted/20 p-0 shadow-none">
        <CardHeader className="border-b p-6">
          <CardTitle className="text-base">Email address</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            A confirmation link is required before your email changes.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <form className="grid gap-4" onSubmit={changeEmail}>
            <Label className="w-full flex-col items-start gap-2">
              New email
              <Input
                type="email"
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                required
                autoComplete="email"
              />
            </Label>
            <Button type="submit" disabled={pending}>
              {pending ? "Sending…" : "Send confirmation email"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Button
        className="w-full justify-between border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
        variant="outline"
        type="button"
        onClick={signOut}
      >
        Sign out
        <LogOut size={16} aria-hidden="true" />
      </Button>
    </div>
  );
}
