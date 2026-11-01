"use client";

import { useQuery } from "@tanstack/react-query";
import type { ManagedProject } from "@/lib/managed-projects";

export function useManagedProjects(initialProjects: ManagedProject[]) {
  return useQuery({
    queryKey: ["managed-projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error("Projects could not be loaded.");
      }
      return (await response.json()) as ManagedProject[];
    },
    initialData: initialProjects,
  });
}
