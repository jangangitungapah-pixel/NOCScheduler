"use client";

import { Button } from "@/components/ui";
import { ShellState } from "@/components/layout/shell-content";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ShellState
      action={
        <Button onClick={reset} variant="primary">
          Coba lagi
        </Button>
      }
      description="Shell tetap aktif, tetapi surface halaman gagal dimuat. Coba ulangi tanpa kehilangan navigational context."
      icon="alert"
      title="Surface gagal dimuat"
    />
  );
}
