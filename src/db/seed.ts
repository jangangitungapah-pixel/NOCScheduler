import { createDatabase } from "./client";
import {
  employeeSalaryVersions,
  employees,
  permissions,
  rolePermissions,
  roles,
  shiftIncentiveVersions,
  shiftTypes,
  shiftTypeVersions,
  systemSettings,
  teams,
  userRoles,
  users,
} from "./schema";

const ids = {
  team: "00000000-0000-4000-8000-000000000001",
  adminUser: "00000000-0000-4000-8000-000000000011",
  schedulerUser: "00000000-0000-4000-8000-000000000012",
  memberUser: "00000000-0000-4000-8000-000000000013",
  adminEmployee: "00000000-0000-4000-8000-000000000021",
  schedulerEmployee: "00000000-0000-4000-8000-000000000022",
  memberEmployee: "00000000-0000-4000-8000-000000000023",
  adminRole: "00000000-0000-4000-8000-000000000031",
  schedulerRole: "00000000-0000-4000-8000-000000000032",
  memberRole: "00000000-0000-4000-8000-000000000033",
  scheduleRead: "00000000-0000-4000-8000-000000000041",
  scheduleManage: "00000000-0000-4000-8000-000000000042",
  payrollRead: "00000000-0000-4000-8000-000000000043",
  accessManage: "00000000-0000-4000-8000-000000000044",
  s1: "00000000-0000-4000-8000-000000000051",
  s2: "00000000-0000-4000-8000-000000000052",
  s3: "00000000-0000-4000-8000-000000000053",
  s1Version: "00000000-0000-4000-8000-000000000061",
  s2Version: "00000000-0000-4000-8000-000000000062",
  s3Version: "00000000-0000-4000-8000-000000000063",
  adminSalary: "00000000-0000-4000-8000-000000000071",
  schedulerSalary: "00000000-0000-4000-8000-000000000072",
  memberSalary: "00000000-0000-4000-8000-000000000073",
  s1Incentive: "00000000-0000-4000-8000-000000000081",
  s2Incentive: "00000000-0000-4000-8000-000000000082",
  s3Incentive: "00000000-0000-4000-8000-000000000083",
} as const;

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required for db:seed");

  const { db, pool } = createDatabase(databaseUrl);

  try {
    await db.insert(teams).values({ id: ids.team, code: "NOC", name: "Network Operations Center" }).onConflictDoNothing();

    await db
      .insert(users)
      .values([
        { id: ids.adminUser, name: "NOC Administrator", email: "admin@nocscheduler.local", emailNormalized: "admin@nocscheduler.local", emailVerified: true, status: "ACTIVE" },
        { id: ids.schedulerUser, name: "NOC Scheduler", email: "scheduler@nocscheduler.local", emailNormalized: "scheduler@nocscheduler.local", emailVerified: true, status: "ACTIVE" },
        { id: ids.memberUser, name: "NOC Member", email: "member@nocscheduler.local", emailNormalized: "member@nocscheduler.local", emailVerified: true, status: "ACTIVE" },
      ])
      .onConflictDoNothing();

    await db
      .insert(employees)
      .values([
        { id: ids.adminEmployee, userId: ids.adminUser, teamId: ids.team, employeeCode: "NOC-001", displayName: "Raka Pratama", status: "ACTIVE", joinDate: "2024-01-01", jobTitle: "NOC Lead" },
        { id: ids.schedulerEmployee, userId: ids.schedulerUser, teamId: ids.team, employeeCode: "NOC-002", displayName: "Dimas Ardi", status: "ACTIVE", joinDate: "2024-03-01", jobTitle: "NOC Scheduler" },
        { id: ids.memberEmployee, userId: ids.memberUser, teamId: ids.team, employeeCode: "NOC-003", displayName: "Alya Putri", status: "ACTIVE", joinDate: "2025-02-01", jobTitle: "NOC Engineer" },
      ])
      .onConflictDoNothing();

    await db
      .insert(roles)
      .values([
        { id: ids.adminRole, code: "ADMINISTRATOR", name: "Administrator", isSystemRole: true },
        { id: ids.schedulerRole, code: "SCHEDULER", name: "Scheduler / Supervisor", isSystemRole: true },
        { id: ids.memberRole, code: "NOC_MEMBER", name: "NOC Member", isSystemRole: true },
      ])
      .onConflictDoNothing();

    await db
      .insert(permissions)
      .values([
        { id: ids.scheduleRead, code: "schedule.read", domain: "schedule", riskLevel: "LOW" },
        { id: ids.scheduleManage, code: "schedule.manage", domain: "schedule", riskLevel: "HIGH" },
        { id: ids.payrollRead, code: "payroll.read", domain: "payroll", riskLevel: "MEDIUM" },
        { id: ids.accessManage, code: "access.manage", domain: "access", riskLevel: "CRITICAL" },
      ])
      .onConflictDoNothing();

    await db
      .insert(rolePermissions)
      .values([
        { roleId: ids.adminRole, permissionId: ids.scheduleRead, defaultScope: "ALL", grantedBy: ids.adminUser },
        { roleId: ids.adminRole, permissionId: ids.scheduleManage, defaultScope: "ALL", grantedBy: ids.adminUser },
        { roleId: ids.adminRole, permissionId: ids.payrollRead, defaultScope: "ALL", grantedBy: ids.adminUser },
        { roleId: ids.adminRole, permissionId: ids.accessManage, defaultScope: "ALL", grantedBy: ids.adminUser },
        { roleId: ids.schedulerRole, permissionId: ids.scheduleRead, defaultScope: "TEAM", grantedBy: ids.adminUser },
        { roleId: ids.schedulerRole, permissionId: ids.scheduleManage, defaultScope: "TEAM", grantedBy: ids.adminUser },
        { roleId: ids.memberRole, permissionId: ids.scheduleRead, defaultScope: "ALL", grantedBy: ids.adminUser },
        { roleId: ids.memberRole, permissionId: ids.payrollRead, defaultScope: "ALL", grantedBy: ids.adminUser },
      ])
      .onConflictDoNothing();

    await db
      .insert(userRoles)
      .values([
        { id: "00000000-0000-4000-8000-000000000091", userId: ids.adminUser, roleId: ids.adminRole, scopeType: "ALL", effectiveFrom: "2026-01-01", grantedBy: ids.adminUser },
        { id: "00000000-0000-4000-8000-000000000092", userId: ids.schedulerUser, roleId: ids.schedulerRole, scopeType: "TEAM", scopeReferenceId: ids.team, effectiveFrom: "2026-01-01", grantedBy: ids.adminUser },
        { id: "00000000-0000-4000-8000-000000000093", userId: ids.memberUser, roleId: ids.memberRole, scopeType: "SELF", effectiveFrom: "2026-01-01", grantedBy: ids.adminUser },
      ])
      .onConflictDoNothing();

    await db
      .insert(shiftTypes)
      .values([
        { id: ids.s1, code: "S1", defaultName: "Shift 1 / Pagi" },
        { id: ids.s2, code: "S2", defaultName: "Shift 2 / Siang" },
        { id: ids.s3, code: "S3", defaultName: "Shift 3 / Malam" },
      ])
      .onConflictDoNothing();

    await db
      .insert(shiftTypeVersions)
      .values([
        { id: ids.s1Version, shiftTypeId: ids.s1, name: "Shift 1 / Pagi", shortName: "S1", startTime: "07:00:00", endTime: "15:00:00", crossesMidnight: false, displayOrder: 1, visualToken: "shift-1", effectiveFrom: "2026-01-01", createdBy: ids.adminUser },
        { id: ids.s2Version, shiftTypeId: ids.s2, name: "Shift 2 / Siang", shortName: "S2", startTime: "15:00:00", endTime: "23:00:00", crossesMidnight: false, displayOrder: 2, visualToken: "shift-2", effectiveFrom: "2026-01-01", createdBy: ids.adminUser },
        { id: ids.s3Version, shiftTypeId: ids.s3, name: "Shift 3 / Malam", shortName: "S3", startTime: "23:00:00", endTime: "07:00:00", crossesMidnight: true, displayOrder: 3, visualToken: "shift-3", effectiveFrom: "2026-01-01", createdBy: ids.adminUser },
      ])
      .onConflictDoNothing();

    await db
      .insert(employeeSalaryVersions)
      .values([
        { id: ids.adminSalary, employeeId: ids.adminEmployee, baseSalaryAmount: 8_000_000, effectiveFrom: "2026-01-01", createdBy: ids.adminUser },
        { id: ids.schedulerSalary, employeeId: ids.schedulerEmployee, baseSalaryAmount: 7_000_000, effectiveFrom: "2026-01-01", createdBy: ids.adminUser },
        { id: ids.memberSalary, employeeId: ids.memberEmployee, baseSalaryAmount: 6_000_000, effectiveFrom: "2026-01-01", createdBy: ids.adminUser },
      ])
      .onConflictDoNothing();

    await db
      .insert(shiftIncentiveVersions)
      .values([
        { id: ids.s1Incentive, shiftTypeId: ids.s1, amount: 0, isIncentiveEnabled: false, effectiveFrom: "2026-01-01", createdBy: ids.adminUser },
        { id: ids.s2Incentive, shiftTypeId: ids.s2, amount: 50_000, isIncentiveEnabled: true, effectiveFrom: "2026-01-01", createdBy: ids.adminUser },
        { id: ids.s3Incentive, shiftTypeId: ids.s3, amount: 75_000, isIncentiveEnabled: true, effectiveFrom: "2026-01-01", createdBy: ids.adminUser },
      ])
      .onConflictDoNothing();

    await db
      .insert(systemSettings)
      .values([
        { key: "default_timezone", value: "Asia/Jakarta", valueType: "STRING", updatedBy: ids.adminUser },
        { key: "default_currency", value: "IDR", valueType: "STRING", updatedBy: ids.adminUser },
      ])
      .onConflictDoNothing();
  } finally {
    await pool.end();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
