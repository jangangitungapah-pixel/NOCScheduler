import { describe, expect, it } from "vitest";

import {
  DESKTOP_NAVIGATION,
  MOBILE_PRIMARY_NAVIGATION,
  filterNavigationGroups,
  getRouteMeta,
  isNavigationItemActive,
} from "./navigation";

describe("F02 navigation contracts", () => {
  it("filters mutation and system navigation by capability without hiding broad reads", () => {
    const groups = filterNavigationGroups(DESKTOP_NAVIGATION, []);
    const labels = groups.flatMap((group) => group.items.map((item) => item.label));

    expect(labels).toContain("Dashboard");
    expect(labels).toContain("My Schedule");
    expect(labels).toContain("Team Schedule");
    expect(labels).toContain("Employees");
    expect(labels).toContain("Payroll Overview");
    expect(labels).not.toContain("Manage Schedule");
    expect(labels).not.toContain("Activity History");
    expect(labels).not.toContain("Settings");
  });

  it("keeps the canonical mobile primary navigation order", () => {
    expect(MOBILE_PRIMARY_NAVIGATION.map((item) => item.label)).toEqual([
      "Home",
      "Schedule",
      "Team",
      "Payroll",
    ]);
  });

  it("preserves active navigation and metadata for nested canonical routes", () => {
    const payroll = DESKTOP_NAVIGATION.flatMap((group) => group.items).find(
      (item) => item.id === "payroll-overview",
    );

    expect(payroll).toBeDefined();
    expect(isNavigationItemActive("/payroll/2026-08/employee-1", payroll!)).toBe(true);
    expect(getRouteMeta("/payroll/2026-08/employee-1")).toMatchObject({
      title: "Employee Payroll Detail",
      area: "Payroll",
      workspace: true,
    });
  });
});
