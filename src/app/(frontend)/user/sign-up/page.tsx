import { generateMetadata } from "@/lib/metadata";
import AuthForm from "@/components/auth-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = generateMetadata(
  "Sign up — SS.me",
  "Create an SS.me account.",
  "/user/sign-up",
);

export default function SignUpPage() {
  return (
    <main className="mx-auto grid min-h-[760px] w-[min(1160px,calc(100%-2rem))] place-items-center py-24">
      <Card className="w-full max-w-[430px] p-9">
        <CardHeader>
          <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">Join SS.me</p>
          <CardTitle>Create an account</CardTitle>
        </CardHeader>
        <CardContent><AuthForm mode="sign-up" /></CardContent>
      </Card>
    </main>
  );
}
