import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import ProfileForm from "./profile-form";
import AccountSettings from "./account-settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Settings, UserRound } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/user/sign-in");

  return (
    <main className="mx-auto min-h-[760px] w-[min(1160px,calc(100%-2rem))] py-28 max-md:py-20">
      <div className="mb-14 max-w-[760px]">
        <p className="font-mono text-[.7rem] uppercase tracking-[.08em] text-muted-foreground">Your account</p>
        <h1 className="my-7 text-[clamp(3.5rem,9vw,7.5rem)] font-medium leading-[.95] tracking-[-.09em] max-md:text-[clamp(3rem,14vw,5rem)]">Your space to <em className="font-semibold not-italic text-primary">personalize.</em></h1>
        <p className="max-w-[520px] text-[1.05rem] leading-6 text-muted-foreground">Manage your public profile details and the settings connected to your SS.me account.</p>
      </div>
      <Tabs defaultValue="profile" className="grid gap-8 lg:max-w-[820px]">
        <TabsList variant="line" className="h-auto w-full items-stretch justify-start gap-0 overflow-x-auto border-b border-border p-0">
          <TabsTrigger value="profile" className="min-w-[155px] justify-center gap-3 border-b-2 border-transparent px-4 py-4 text-center">
            <UserRound size={16} aria-hidden="true" />
            Profile details
          </TabsTrigger>
          <TabsTrigger value="settings" className="min-w-[155px] justify-center gap-3 border-b-2 border-transparent px-4 py-4 text-center">
            <Settings size={16} aria-hidden="true" />
            User settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card className="bg-muted/20 p-0 shadow-none">
            <CardHeader className="border-b p-6">
              <div className="flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-items-center border border-border bg-background text-primary">
                  <Camera size={18} aria-hidden="true" />
                </div>
                <div>
                  <CardTitle className="text-base">Profile details</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">The public details connected to your SS.me account.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6"><ProfileForm /></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <AccountSettings email={session.user.email} createdAt={session.user.createdAt} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
