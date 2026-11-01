import { get, put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkRateLimit, getClientAddress } from "@/lib/rate-limit";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxFileSize = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(`profile-image:${getClientAddress(request)}`, 10, 60 * 60 * 1000);
  if (!rateLimit.allowed) {
    return Response.json(
      { error: "Too many uploads. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.retryAfter / 1000)) } },
    );
  }
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || !allowedTypes.has(file.type)) {
    return Response.json({ error: "Please upload a JPG, PNG, or WebP image." }, { status: 400 });
  }
  if (file.size > maxFileSize) {
    return Response.json({ error: "Profile images must be 5 MB or smaller." }, { status: 400 });
  }

  try {
    const blob = await put(`profiles/${session.user.id}/${crypto.randomUUID()}-${file.name}`, file, {
      access: "private",
      addRandomSuffix: false,
    });
    return Response.json({
      url: `/api/profile/image?path=${encodeURIComponent(blob.pathname)}`,
    });
  } catch (error) {
    console.error("Profile image upload failed", error);
    return Response.json({ error: "The image could not be uploaded." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const pathname = new URL(request.url).searchParams.get("path");
  if (!pathname || !pathname.startsWith(`profiles/${session.user.id}/`)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const blob = await get(pathname, { access: "private" });
    if (!blob) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(blob.stream, {
      headers: {
        "Cache-Control": "private, max-age=3600",
        "Content-Type": blob.blob.contentType || "application/octet-stream",
      },
    });
  } catch (error) {
    console.error("Profile image retrieval failed", error);
    return new Response("The image could not be loaded.", { status: 500 });
  }
}
