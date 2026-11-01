import { getManagedProjects } from "@/lib/managed-projects";

export async function GET() {
  return Response.json(await getManagedProjects(), {
    headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
  });
}
