import type { IconName } from "@/components/ui/icon";

export type AppCapability = "schedule.manage" | "audit.view" | "settings.view" | "access.manage";

export type NavigationItem = {
  id: string;
  label: string;
  href: string;
  icon: IconName;
  capability?: AppCapability;
  activePrefixes?: string[];
};

export type NavigationGroup = {
  id: string;
  label: string;
  items: NavigationItem[];
};

export type RouteMeta = {
  title: string;
  description: string;
  area: string;
  workspace?: boolean;
};

export const SHELL_DEMO_CAPABILITIES: readonly AppCapability[] = [
  "schedule.manage",
  "audit.view",
  "settings.view",
  "access.manage",
];

export const DESKTOP_NAVIGATION: readonly NavigationGroup[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/dashboard",
        icon: "home",
      },
    ],
  },
  {
    id: "schedule",
    label: "Schedule",
    items: [
      {
        id: "my-schedule",
        label: "My Schedule",
        href: "/schedule/me",
        icon: "calendar",
      },
      {
        id: "team-schedule",
        label: "Team Schedule",
        href: "/schedule/team",
        icon: "users",
      },
      {
        id: "manage-schedule",
        label: "Manage Schedule",
        href: "/schedule/manage",
        icon: "panel-left",
        capability: "schedule.manage",
      },
      {
        id: "requests",
        label: "Requests",
        href: "/schedule/requests",
        icon: "file-text",
      },
    ],
  },
  {
    id: "people",
    label: "People",
    items: [
      {
        id: "employees",
        label: "Employees",
        href: "/employees",
        icon: "users",
      },
    ],
  },
  {
    id: "payroll",
    label: "Payroll",
    items: [
      {
        id: "payroll-overview",
        label: "Payroll Overview",
        href: "/payroll",
        icon: "wallet",
      },
      {
        id: "monthly-payroll",
        label: "Monthly Payroll",
        href: "/payroll/2026-08",
        icon: "calendar",
        activePrefixes: ["/payroll/"],
      },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    items: [
      {
        id: "reports",
        label: "Reports",
        href: "/reports",
        icon: "chart",
      },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      {
        id: "activity",
        label: "Activity History",
        href: "/activity",
        icon: "history",
        capability: "audit.view",
      },
      {
        id: "settings",
        label: "Settings",
        href: "/settings",
        icon: "settings",
        capability: "settings.view",
      },
    ],
  },
];

export const MOBILE_PRIMARY_NAVIGATION: readonly NavigationItem[] = [
  { id: "home", label: "Home", href: "/dashboard", icon: "home" },
  { id: "schedule", label: "Schedule", href: "/schedule/me", icon: "calendar" },
  { id: "team", label: "Team", href: "/employees", icon: "users" },
  { id: "payroll", label: "Payroll", href: "/payroll", icon: "wallet" },
];

export const MOBILE_MORE_NAVIGATION: readonly NavigationItem[] = [
  { id: "requests", label: "Requests", href: "/schedule/requests", icon: "file-text" },
  { id: "reports", label: "Reports", href: "/reports", icon: "chart" },
  {
    id: "manage-schedule",
    label: "Manage Schedule",
    href: "/schedule/manage",
    icon: "panel-left",
    capability: "schedule.manage",
  },
  {
    id: "activity",
    label: "Activity History",
    href: "/activity",
    icon: "history",
    capability: "audit.view",
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: "settings",
    capability: "settings.view",
  },
  { id: "notifications", label: "Notifications", href: "/notifications", icon: "bell" },
  { id: "profile", label: "Profile", href: "/profile", icon: "user" },
];

export function hasCapability(
  capability: AppCapability | undefined,
  capabilities: readonly AppCapability[],
) {
  return !capability || capabilities.includes(capability);
}

export function filterNavigationItems(
  items: readonly NavigationItem[],
  capabilities: readonly AppCapability[],
) {
  return items.filter((item) => hasCapability(item.capability, capabilities));
}

export function filterNavigationGroups(
  groups: readonly NavigationGroup[],
  capabilities: readonly AppCapability[],
) {
  return groups
    .map((group) => ({
      ...group,
      items: filterNavigationItems(group.items, capabilities),
    }))
    .filter((group) => group.items.length > 0);
}

export function isNavigationItemActive(pathname: string, item: NavigationItem) {
  if (pathname === item.href) return true;
  if (item.activePrefixes?.some((prefix) => pathname.startsWith(prefix))) return true;

  if (item.href === "/payroll" && pathname.startsWith("/payroll/")) return true;
  if (item.href === "/employees" && pathname.startsWith("/employees/")) return true;
  if (item.href === "/reports" && pathname.startsWith("/reports/")) return true;
  if (item.href === "/settings" && pathname.startsWith("/settings/")) return true;

  return false;
}

const exactRoutes: Record<string, RouteMeta> = {
  "/dashboard": {
    title: "Dashboard",
    description:
      "Operational landing page untuk kondisi kerja, shift, perubahan, dan perhatian penting.",
    area: "Overview",
  },
  "/schedule": {
    title: "Schedule",
    description: "Entry point area jadwal. Default consumption flow akan mengarah ke My Schedule.",
    area: "Schedule",
  },
  "/schedule/me": {
    title: "My Schedule",
    description: "Jadwal personal, today/next shift, dan konteks perubahan jadwal.",
    area: "Schedule",
    workspace: true,
  },
  "/schedule/team": {
    title: "Team Schedule",
    description: "Jadwal seluruh tim dan konteks coverage dalam mode read-oriented.",
    area: "Schedule",
    workspace: true,
  },
  "/schedule/manage": {
    title: "Manage Schedule",
    description:
      "Power workspace untuk draft, validation, bulk assignment, publish, dan correction.",
    area: "Schedule",
    workspace: true,
  },
  "/schedule/requests": {
    title: "Requests",
    description: "Permintaan schedule, leave, swap, replacement, dan exception operasional.",
    area: "Schedule",
  },
  "/employees": {
    title: "Employees",
    description:
      "Directory anggota NOC dan entry point ke konteks schedule, payroll, serta history.",
    area: "People",
  },
  "/payroll": {
    title: "Payroll Overview",
    description: "Ringkasan periode payroll dan entry point ke monthly payroll detail.",
    area: "Payroll",
    workspace: true,
  },
  "/reports": {
    title: "Reports",
    description: "Canonical reporting, analytics, reconciliation, dan export entry point.",
    area: "Reports",
    workspace: true,
  },
  "/reports/schedule": {
    title: "Schedule Reports",
    description: "Reporting schedule, distribution, fairness, dan coverage.",
    area: "Reports",
    workspace: true,
  },
  "/reports/payroll": {
    title: "Payroll Reports",
    description: "Reporting payroll, component, comparison, dan reconciliation.",
    area: "Reports",
    workspace: true,
  },
  "/reports/employees": {
    title: "Employee Reports",
    description: "Employee monthly operational summary dan historical context.",
    area: "Reports",
    workspace: true,
  },
  "/activity": {
    title: "Activity History",
    description: "Business history dan audit investigation surface.",
    area: "System",
    workspace: true,
  },
  "/settings": {
    title: "Settings",
    description:
      "Canonical configuration entry point. Daily operational work tetap berada di area domain.",
    area: "System",
  },
  "/settings/general": {
    title: "General Settings",
    description: "Konfigurasi umum aplikasi.",
    area: "System",
  },
  "/settings/shifts": {
    title: "Shift Settings",
    description: "Konfigurasi shift dan effective-dated version.",
    area: "System",
  },
  "/settings/payroll": {
    title: "Payroll Settings",
    description: "Konfigurasi parameter payroll.",
    area: "System",
  },
  "/settings/compensation": {
    title: "Compensation Settings",
    description: "Konfigurasi salary dan incentive effective-dated.",
    area: "System",
  },
  "/settings/holidays": {
    title: "Holiday Settings",
    description: "Kalender hari libur dan operational context.",
    area: "System",
  },
  "/settings/access": {
    title: "Access Settings",
    description: "Role, capability, scope, dan account access.",
    area: "System",
  },
  "/settings/notifications": {
    title: "Notification Settings",
    description: "Preferensi awareness dan delivery channel.",
    area: "System",
  },
  "/profile": {
    title: "Profile",
    description: "Identitas user dan account-level preferences.",
    area: "Account",
  },
  "/notifications": {
    title: "Notifications",
    description: "Full operational awareness center dengan deep-link ke source context.",
    area: "Account",
  },
};

const dynamicRoutes: Array<{ pattern: RegExp; meta: RouteMeta }> = [
  {
    pattern: /^\/schedule\/manage\/[^/]+$/,
    meta: {
      title: "Manage Schedule",
      description: "Period-scoped schedule management workspace.",
      area: "Schedule",
      workspace: true,
    },
  },
  {
    pattern: /^\/schedule\/requests\/[^/]+$/,
    meta: {
      title: "Request Detail",
      description: "Request state, context, approval history, dan linked operational records.",
      area: "Schedule",
    },
  },
  {
    pattern: /^\/employees\/[^/]+$/,
    meta: {
      title: "Employee Overview",
      description: "Employee overview dengan entry point schedule, payroll, dan history.",
      area: "People",
    },
  },
  {
    pattern: /^\/employees\/[^/]+\/schedule$/,
    meta: {
      title: "Employee Schedule",
      description: "Historical dan current schedule context untuk employee terpilih.",
      area: "People",
      workspace: true,
    },
  },
  {
    pattern: /^\/employees\/[^/]+\/payroll$/,
    meta: {
      title: "Employee Payroll",
      description: "Historical payroll context untuk employee terpilih.",
      area: "People",
      workspace: true,
    },
  },
  {
    pattern: /^\/payroll\/[^/]+$/,
    meta: {
      title: "Monthly Payroll",
      description: "Period-scoped payroll review dan source traceability.",
      area: "Payroll",
      workspace: true,
    },
  },
  {
    pattern: /^\/payroll\/[^/]+\/[^/]+$/,
    meta: {
      title: "Employee Payroll Detail",
      description: "Employee payroll breakdown, source, revision, dan lifecycle status.",
      area: "Payroll",
      workspace: true,
    },
  },
  {
    pattern: /^\/activity\/[^/]+$/,
    meta: {
      title: "Activity Detail",
      description: "Audit/business-history event context dan linked source.",
      area: "System",
    },
  },
];

export function getRouteMeta(pathname: string): RouteMeta | null {
  const exact = exactRoutes[pathname];
  if (exact) return exact;
  return dynamicRoutes.find((entry) => entry.pattern.test(pathname))?.meta ?? null;
}
