export type ShiftCode = "S1" | "S2" | "S3" | "OFF" | "LEAVE" | "EXCEPTION";

export type EmployeeFixture = {
  id: string;
  name: string;
  shortName: string;
  role: string;
  status: "ACTIVE" | "INACTIVE";
  initials: string;
};

export type ScheduleCellFixture = {
  workDate: string;
  dayLabel: string;
  dateLabel: string;
  shift: ShiftCode;
  start?: string;
  end?: string;
  state: "PLANNED" | "EFFECTIVE";
  note?: string;
};

export type ScheduleRowFixture = {
  employeeId: string;
  employeeName: string;
  initials: string;
  cells: ScheduleCellFixture[];
};

export type PayrollRowFixture = {
  employeeId: string;
  employeeName: string;
  baseSalary: number;
  s2Count: number;
  s2Amount: number;
  s3Count: number;
  s3Amount: number;
  adjustments: number;
  takeHomePay: number;
  status: "CALCULATED" | "FINALIZED" | "LOCKED";
};

export type RequestFixture = {
  id: string;
  type: "LEAVE" | "SWAP" | "REPLACEMENT" | "OVERTIME" | "PERMISSION";
  employeeName: string;
  dateLabel: string;
  summary: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
};

export const employees: EmployeeFixture[] = [
  {
    id: "emp-001",
    name: "Raka Pratama",
    shortName: "Raka",
    role: "NOC Engineer",
    status: "ACTIVE",
    initials: "RP",
  },
  {
    id: "emp-002",
    name: "Nadia Putri",
    shortName: "Nadia",
    role: "NOC Engineer",
    status: "ACTIVE",
    initials: "NP",
  },
  {
    id: "emp-003",
    name: "Dimas Saputra",
    shortName: "Dimas",
    role: "NOC Engineer",
    status: "ACTIVE",
    initials: "DS",
  },
  {
    id: "emp-004",
    name: "Sinta Maharani",
    shortName: "Sinta",
    role: "NOC Engineer",
    status: "ACTIVE",
    initials: "SM",
  },
  {
    id: "emp-005",
    name: "Arif Nugroho",
    shortName: "Arif",
    role: "NOC Engineer",
    status: "ACTIVE",
    initials: "AN",
  },
  {
    id: "emp-006",
    name: "Yusuf Ramadhan",
    shortName: "Yusuf",
    role: "NOC Supervisor",
    status: "ACTIVE",
    initials: "YR",
  },
];

const scheduleDates = [
  ["2026-08-11", "Sel", "11"],
  ["2026-08-12", "Rab", "12"],
  ["2026-08-13", "Kam", "13"],
  ["2026-08-14", "Jum", "14"],
  ["2026-08-15", "Sab", "15"],
  ["2026-08-16", "Min", "16"],
  ["2026-08-17", "Sen", "17"],
] as const;

const shiftsByEmployee: ShiftCode[][] = [
  ["S1", "S1", "S2", "S2", "OFF", "OFF", "S3"],
  ["S2", "S2", "OFF", "S3", "S3", "OFF", "S1"],
  ["S3", "OFF", "S1", "S1", "S2", "S2", "OFF"],
  ["OFF", "S3", "S3", "OFF", "S1", "S1", "S2"],
  ["S1", "LEAVE", "LEAVE", "S2", "S2", "S3", "S3"],
  ["S2", "S1", "S1", "S3", "OFF", "S2", "OFF"],
];

function shiftTime(shift: ShiftCode) {
  if (shift === "S1") return { start: "07:00", end: "15:00" };
  if (shift === "S2") return { start: "15:00", end: "23:00" };
  if (shift === "S3") return { start: "23:00", end: "07:00" };
  return {};
}

export const teamSchedule: ScheduleRowFixture[] = employees.map((employee, employeeIndex) => ({
  employeeId: employee.id,
  employeeName: employee.name,
  initials: employee.initials,
  cells: scheduleDates.map(([workDate, dayLabel, dateLabel], dateIndex) => {
    const shift = shiftsByEmployee[employeeIndex]?.[dateIndex] ?? "OFF";
    return {
      workDate,
      dayLabel,
      dateLabel,
      shift,
      state: dateIndex <= 1 ? "EFFECTIVE" : "PLANNED",
      ...shiftTime(shift),
      ...(employee.id === "emp-005" && shift === "LEAVE" ? { note: "Annual leave" } : {}),
    };
  }),
}));

export const mySchedule: ScheduleCellFixture[] = [
  {
    workDate: "2026-08-13",
    dayLabel: "Kamis",
    dateLabel: "13",
    shift: "S2",
    state: "PLANNED",
    start: "15:00",
    end: "23:00",
    note: "Main NOC floor",
  },
  {
    workDate: "2026-08-14",
    dayLabel: "Jumat",
    dateLabel: "14",
    shift: "S2",
    state: "PLANNED",
    start: "15:00",
    end: "23:00",
  },
  {
    workDate: "2026-08-15",
    dayLabel: "Sabtu",
    dateLabel: "15",
    shift: "OFF",
    state: "PLANNED",
  },
  {
    workDate: "2026-08-16",
    dayLabel: "Minggu",
    dateLabel: "16",
    shift: "OFF",
    state: "PLANNED",
  },
  {
    workDate: "2026-08-17",
    dayLabel: "Senin",
    dateLabel: "17",
    shift: "S3",
    state: "PLANNED",
    start: "23:00",
    end: "07:00",
    note: "Holiday coverage",
  },
  {
    workDate: "2026-08-18",
    dayLabel: "Selasa",
    dateLabel: "18",
    shift: "S3",
    state: "PLANNED",
    start: "23:00",
    end: "07:00",
  },
];

export const payrollRows: PayrollRowFixture[] = [
  {
    employeeId: "emp-001",
    employeeName: "Raka Pratama",
    baseSalary: 7_500_000,
    s2Count: 7,
    s2Amount: 350_000,
    s3Count: 5,
    s3Amount: 375_000,
    adjustments: 125_000,
    takeHomePay: 8_350_000,
    status: "CALCULATED",
  },
  {
    employeeId: "emp-002",
    employeeName: "Nadia Putri",
    baseSalary: 7_500_000,
    s2Count: 6,
    s2Amount: 300_000,
    s3Count: 6,
    s3Amount: 450_000,
    adjustments: 0,
    takeHomePay: 8_250_000,
    status: "FINALIZED",
  },
  {
    employeeId: "emp-003",
    employeeName: "Dimas Saputra",
    baseSalary: 7_250_000,
    s2Count: 7,
    s2Amount: 350_000,
    s3Count: 5,
    s3Amount: 375_000,
    adjustments: -75_000,
    takeHomePay: 7_900_000,
    status: "CALCULATED",
  },
  {
    employeeId: "emp-004",
    employeeName: "Sinta Maharani",
    baseSalary: 7_500_000,
    s2Count: 6,
    s2Amount: 300_000,
    s3Count: 6,
    s3Amount: 450_000,
    adjustments: 100_000,
    takeHomePay: 8_350_000,
    status: "LOCKED",
  },
  {
    employeeId: "emp-005",
    employeeName: "Arif Nugroho",
    baseSalary: 7_250_000,
    s2Count: 5,
    s2Amount: 250_000,
    s3Count: 5,
    s3Amount: 375_000,
    adjustments: 0,
    takeHomePay: 7_875_000,
    status: "CALCULATED",
  },
];

export const requests: RequestFixture[] = [
  {
    id: "REQ-2608-014",
    type: "SWAP",
    employeeName: "Nadia Putri",
    dateLabel: "14 Aug 2026",
    summary: "Swap S3 dengan Dimas untuk kebutuhan keluarga.",
    status: "PENDING",
  },
  {
    id: "REQ-2608-013",
    type: "LEAVE",
    employeeName: "Arif Nugroho",
    dateLabel: "12–13 Aug 2026",
    summary: "Annual leave dua hari, replacement sudah ditunjuk.",
    status: "APPROVED",
  },
  {
    id: "REQ-2608-012",
    type: "OVERTIME",
    employeeName: "Raka Pratama",
    dateLabel: "11 Aug 2026",
    summary: "Overtime 2 jam untuk incident handover.",
    status: "APPROVED",
  },
  {
    id: "REQ-2608-011",
    type: "PERMISSION",
    employeeName: "Sinta Maharani",
    dateLabel: "10 Aug 2026",
    summary: "Izin datang terlambat pada Shift 1.",
    status: "REJECTED",
  },
];

export const dashboardFixture = {
  currentEmployee: employees[0]!,
  today: {
    dateLabel: "Kamis, 13 Agustus",
    shift: "S2" as ShiftCode,
    start: "15:00",
    end: "23:00",
    location: "Main NOC Floor",
    handoverAt: "14:45",
  },
  nextShift: {
    dateLabel: "Jumat, 14 Agustus",
    shift: "S2" as ShiftCode,
    start: "15:00",
    end: "23:00",
  },
  nowOnDuty: [
    { employeeId: "emp-002", name: "Nadia Putri", initials: "NP", shift: "S2" as ShiftCode },
    { employeeId: "emp-003", name: "Dimas Saputra", initials: "DS", shift: "S2" as ShiftCode },
    { employeeId: "emp-006", name: "Yusuf Ramadhan", initials: "YR", shift: "S2" as ShiftCode },
  ],
  monthlySummary: [
    { label: "Shift 1", value: "7", context: "planned" },
    { label: "Shift 2", value: "7", context: "Rp350k incentive" },
    { label: "Shift 3", value: "5", context: "Rp375k incentive" },
    { label: "OFF / Leave", value: "12", context: "days" },
  ],
  changes: [
    {
      title: "Shift 17 Agustus berubah",
      detail: "S2 → S3 · published oleh Yusuf Ramadhan",
      time: "18 menit lalu",
    },
    {
      title: "Swap Nadia ↔ Dimas diajukan",
      detail: "Menunggu keputusan scheduler untuk 14 Agustus",
      time: "42 menit lalu",
    },
    {
      title: "Payroll Agustus dihitung ulang",
      detail: "Source schedule berubah; period ditandai dirty sebelum recalculation",
      time: "1 jam lalu",
    },
  ],
  attention: [
    { tone: "danger" as const, label: "Coverage gap", value: "1", detail: "S3 · 18 Aug" },
    { tone: "warning" as const, label: "Pending requests", value: "3", detail: "1 swap high priority" },
    { tone: "info" as const, label: "Payroll state", value: "Dirty", detail: "Needs recalculation" },
  ],
};

export const reportMetrics = [
  { label: "Planned coverage", value: "98.4%", delta: "+1.8% vs Jul" },
  { label: "Effective coverage", value: "96.8%", delta: "2 gaps resolved" },
  { label: "Avg S2 / employee", value: "6.3", delta: "spread 5–7" },
  { label: "Avg S3 / employee", value: "5.4", delta: "spread 5–6" },
];

export const activityEvents = [
  {
    id: "AUD-8041",
    actor: "Yusuf Ramadhan",
    action: "Published schedule correction",
    resource: "August 2026 · Week 3",
    time: "13 Aug 2026 · 17:22",
    reason: "Holiday coverage adjustment",
    severity: "NOTICE",
  },
  {
    id: "AUD-8039",
    actor: "Nadia Putri",
    action: "Submitted swap request",
    resource: "REQ-2608-014",
    time: "13 Aug 2026 · 16:58",
    reason: "Family requirement",
    severity: "INFO",
  },
  {
    id: "AUD-8037",
    actor: "System fixture",
    action: "Marked payroll dirty",
    resource: "Payroll · August 2026",
    time: "13 Aug 2026 · 16:55",
    reason: "Published schedule source changed",
    severity: "WARNING",
  },
];

export const notificationsFixture = [
  {
    id: "NTF-101",
    group: "Schedule",
    title: "Schedule correction published",
    detail: "Shift kamu pada 17 Agustus berubah dari S2 menjadi S3.",
    time: "18m",
    state: "UNREAD",
    href: "/schedule/me",
  },
  {
    id: "NTF-100",
    group: "Request",
    title: "Swap request needs review",
    detail: "REQ-2608-014 menunggu keputusan scheduler.",
    time: "42m",
    state: "UNREAD",
    href: "/schedule/requests/REQ-2608-014",
  },
  {
    id: "NTF-099",
    group: "Payroll",
    title: "Payroll source changed",
    detail: "Payroll Agustus ditandai dirty sampai recalculation dijalankan.",
    time: "1h",
    state: "READ",
    href: "/payroll/2026-08",
  },
  {
    id: "NTF-094",
    group: "Coverage",
    title: "Coverage warning resolved",
    detail: "Replacement untuk Shift 3 tanggal 12 Agustus sudah terisi.",
    time: "2d",
    state: "RESOLVED",
    href: "/schedule/team",
  },
];
