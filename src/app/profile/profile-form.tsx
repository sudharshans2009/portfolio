"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Upload } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toast";

export default function ProfileForm() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pending, setPending] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session?.user && !name) {
      setName(session.user.name.trim() || session.user.email);
    }
    if (session?.user?.image && !imageUrl) {
      setImageUrl(session.user.image);
    }
  }, [imageUrl, name, session?.user]);

  if (isPending) return null;
  if (!session?.user) {
    router.replace("/user/sign-in");
    return null;
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const result = await authClient.updateUser({
      name: name.trim(),
      image: imageUrl.trim() || undefined,
    });
    setPending(false);
    if (result.error) {
      toast.add({
        type: "error",
        title: "Profile update failed",
        description: result.error.message || "Profile could not be updated.",
      });
      return;
    }
    await authClient.getSession();
    toast.add({
      type: "success",
      title: "Profile updated",
      description: "Your profile details have been saved.",
    });
  }

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPending(true);
    const formData = new FormData();
    formData.set("file", file);
    const response = await fetch("/api/profile/image", {
      method: "POST",
      body: formData,
    });
    const result = (await response.json()) as { url?: string; error?: string };
    setPending(false);
    if (!response.ok || !result.url) {
      toast.add({
        type: "error",
        title: "Image upload failed",
        description: result.error || "Profile image could not be uploaded.",
      });
      return;
    }
    setImageUrl(result.url);
    const update = await authClient.updateUser({ image: result.url });
    if (update.error) {
      toast.add({
        type: "error",
        title: "Profile image failed",
        description:
          update.error.message || "Profile image could not be saved.",
      });
      return;
    }
    toast.add({
      type: "success",
      title: "Profile image updated",
      description: "Your new profile image is now active.",
    });
  }

  async function removeImage() {
    setPending(true);
    const result = await authClient.updateUser({ image: null });
    setPending(false);
    if (result.error) {
      toast.add({
        type: "error",
        title: "Profile image removal failed",
        description:
          result.error.message || "Profile image could not be removed.",
      });
      return;
    }

    await authClient.getSession();
    setImageUrl("");
    toast.add({
      type: "success",
      title: "Profile image removed",
      description: "Your profile now uses your initials.",
    });
  }

  return (
    <form className="grid gap-5" onSubmit={saveProfile}>
      <div className="flex items-center gap-5 border-b border-border pb-6">
        <Label
          className="profile-avatar group relative grid size-24 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full bg-muted"
          htmlFor="profile-image-upload"
        >
          <Avatar
            className="profile-avatar !size-full rounded-full bg-muted transition-colors group-hover:bg-muted/80"
            size="lg"
          >
            <AvatarImage src={imageUrl} alt="" />
            <AvatarFallback className="bg-muted text-3xl font-semibold text-primary">
              {name.trim().slice(0, 1).toUpperCase() || (
                <Camera size={24} aria-hidden="true" />
              )}
            </AvatarFallback>
          </Avatar>
          <span className="absolute inset-0 grid place-items-center bg-foreground/70 text-background opacity-0 transition-opacity group-hover:opacity-100">
            <Upload size={19} aria-hidden="true" />
            <span className="sr-only">Choose profile image</span>
          </span>
          <Input
            id="profile-image-upload"
            ref={imageInputRef}
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={uploadImage}
            disabled={pending}
          />
        </Label>
        <div>
          <p className="text-sm font-semibold">Profile image</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Upload a square JPG, PNG, or WebP up to 5 MB.
          </p>
          {imageUrl && (
            <Button
              type="button"
              variant="link"
              size="sm"
              className="mt-2 h-auto px-0 text-destructive"
              onClick={removeImage}
              disabled={pending}
            >
              Remove image
            </Button>
          )}
        </div>
      </div>
      <Label className="w-full flex-col items-start gap-2">
        Name
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          minLength={2}
        />
      </Label>
      <Label className="w-full flex-col items-start gap-2">
        Email
        <Input value={session.user.email} readOnly type="email" />
      </Label>
      <Button type="submit" disabled={pending} size="lg">
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
