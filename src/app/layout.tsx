import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Poppins } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ThemeToggle from "@/components/theme-toggle";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toast";
import { siteConfig } from "@/lib/site-config";
import "@/app/styles.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  alternates: { canonical: siteConfig.url },
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f4ef",
};

export default function FrontendLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${jetBrainsMono.variable}`}
    >
      <body className="font-sans">
        <TooltipProvider>
          <Toaster>
          <Navbar />
          {children}
          <Footer>
            <ThemeToggle />
          </Footer>
          </Toaster>
        </TooltipProvider>
      </body>
    </html>
  );
}
