export const siteConfig = {
  name: "SS.me",
  title: "Home - SS.me",
  description:
    "I am a high school student in India who builds coding projects with TypeScript, JavaScript, and Python.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://sudharshans.me",
  email: "contact@sudharshans.me",
  ownerEmail: process.env.CONTACT_OWNER_EMAIL || "sudharshans2009@gmail.com",
  github: "https://github.com/sudharshans2009",
  positioning:
    "I build coding projects with TypeScript, JavaScript, and Python.",
  location: "India",
} as const;

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
] as const;
