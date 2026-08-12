import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RoutePlaceholder } from "@/components/layout/shell-content";
import { getRouteMeta } from "@/components/layout/navigation";

type CanonicalRouteProps = {
  params: Promise<{ segments: string[] }>;
};

function toPathname(segments: string[]) {
  return `/${segments.join("/")}`;
}

export async function generateMetadata({ params }: CanonicalRouteProps): Promise<Metadata> {
  const { segments } = await params;
  const meta = getRouteMeta(toPathname(segments));
  return meta ? { title: meta.title, description: meta.description } : {};
}

export default async function CanonicalRoutePage({ params }: CanonicalRouteProps) {
  const { segments } = await params;
  const pathname = toPathname(segments);
  const meta = getRouteMeta(pathname);

  if (!meta) notFound();

  return <RoutePlaceholder meta={meta} pathname={pathname} />;
}
