import type { Metadata } from "next";
import { siteConfig } from "./site-config";

type MetadataOverrides = {
  description?: string;
  images?: NonNullable<Metadata["openGraph"]>["images"];
};

export function generateMetadata(
  first: string = siteConfig.title,
  second: string = siteConfig.description,
  third: string | MetadataOverrides = "/",
): Metadata {
  const legacyCall = first.startsWith("http");
  const title = legacyCall ? second : first;
  const description =
    legacyCall && typeof third !== "string"
      ? third.description || siteConfig.description
      : legacyCall
        ? siteConfig.description
        : second;
  const path = legacyCall ? first : typeof third === "string" ? third : "/";
  const overrides = !legacyCall && typeof third !== "string" ? third : undefined;
  const url = new URL(path, siteConfig.url).toString();

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    alternates: { canonical: url },
    icons: { icon: "/favicon.ico" },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "en-US",
      type: "website",
      ...(overrides?.images ? { images: overrides.images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}
