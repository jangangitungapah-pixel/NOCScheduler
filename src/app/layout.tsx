import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/ui/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NOCScheduler",
    template: "%s · NOCScheduler",
  },
  description: "Internal NOC scheduling and payroll operational workspace.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html data-theme="light" lang="id">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
