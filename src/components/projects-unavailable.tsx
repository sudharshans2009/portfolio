"use client";

import { useEffect } from "react";
import { toast } from "@/components/ui/toast";

export default function ProjectsUnavailable() {
  useEffect(() => {
    toast.add({
      type: "error",
      title: "Projects unavailable",
      description: "The project list could not be loaded right now.",
    });
  }, []);

  return null;
}
