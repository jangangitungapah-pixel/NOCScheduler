import Link from "next/link";

import { ShellState } from "@/components/layout/shell-content";

export default function AppNotFound() {
  return (
    <ShellState
      action={<Link href="/dashboard">Kembali ke Dashboard</Link>}
      description="Route ini tidak termasuk canonical information architecture NOCScheduler atau sudah tidak tersedia."
      icon="info"
      title="Halaman tidak ditemukan"
    />
  );
}
