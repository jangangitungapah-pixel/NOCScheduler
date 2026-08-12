import type { Metadata } from "next";

import { DesignSystemClient } from "./design-system-client";

export const metadata: Metadata = {
  title: "Design System",
  description: "NOCScheduler WP-F01 visual reference and shared component acceptance surface.",
};

export default function DesignSystemPage() {
  return <DesignSystemClient />;
}
