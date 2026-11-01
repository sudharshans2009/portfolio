import { generateMetadata } from "@/lib/metadata";
import AuthForm from "@/components/auth-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = generateMetadata(
  "Login — SS.me",
  "Login to your SS.me account.",
  "/user/sign-in",
);

export default function SignInPage() {
  return (
    <main className="mx-auto grid min-h-[760px] w-[min(1160px,calc(100%-2rem))] place-items-center py-24">
      <Card className="w-full max-w-[430px] p-9">
        <CardHeader>
          <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">Welcome back</p>
          <CardTitle>Login to SS.me</CardTitle>
        </CardHeader>
        <CardContent><AuthForm mode="sign-in" /></CardContent>
      </Card>
    </main>
  );
}
