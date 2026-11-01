import { describe, expect, test } from "bun:test";
import { generateMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

describe("SS.me metadata", () => {
  test("uses the canonical site URL for page metadata", () => {
    const metadata = generateMetadata(
      "Work | SS.me",
      "Selected work by Sudharshan S.",
      "/projects",
    );

    expect(metadata.alternates?.canonical).toBe(
      `${siteConfig.url}/projects`,
    );
    expect(metadata.description).toBe("Selected work by Sudharshan S.");
  });

  test("keeps the approved positioning in the site configuration", () => {
    expect(siteConfig.positioning).toBe(
      "I build coding projects with TypeScript, JavaScript, and Python.",
    );
  });
});
