"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

export default function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const isSignUp = mode === "sign-up";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);

    const result = isSignUp
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password });

    setPending(false);
    if (result.error) {
      toast.add({
        type: "error",
        title: isSignUp ? "Sign-up failed" : "Login failed",
        description:
          result.error.message || "Authentication failed. Please try again.",
      });
      return;
    }

    toast.add({
      type: "success",
      title: isSignUp ? "Account created" : "Login successful",
      description: isSignUp
        ? "Your SS.me account is ready."
        : "Welcome back to SS.me.",
    });
    router.push("/profile");
    router.refresh();
  }

  return (
    <form className="grid gap-5" onSubmit={submit}>
      {isSignUp && (
        <Label className="w-full flex-col items-start gap-2">
          Name
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            autoComplete="name"
          />
        </Label>
      )}
      <Label className="w-full flex-col items-start gap-2">
        Email
        <Input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          required
          autoComplete="email"
        />
      </Label>
      <Label className="w-full flex-col items-start gap-2">
        Password
        <Input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          required
          minLength={8}
          autoComplete={isSignUp ? "new-password" : "current-password"}
        />
      </Label>
      <Button type="submit" disabled={pending} size="lg">
        {pending ? "Please wait…" : isSignUp ? "Create account" : "Login"}
      </Button>
      <p className="text-xs text-muted-foreground">
        {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
        <Link href={isSignUp ? "/user/sign-in" : "/user/sign-up"}>
          {isSignUp ? "Login" : "Sign up"}
        </Link>
      </p>
      {!isSignUp && (
        <Link
          className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          href="/user/forgot-password"
        >
          Forgot your password?
        </Link>
      )}
    </form>
  );
}
