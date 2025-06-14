import type { Metadata } from "next";
import { GeistSans as sans } from "geist/font/sans";
import { GeistMono as mono } from "geist/font/mono";
import { cn } from "@/server/utilities/utils";

import "@/app/globals.css";
import { ThemeProvider } from "@/compose/theme-provider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", sans.variable, mono.variable)}
    >
      <body className={`flex min-h-screen bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex-1">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
