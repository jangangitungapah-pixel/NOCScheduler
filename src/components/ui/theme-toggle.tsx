"use client";

import { Button } from "./button";
import { Icon } from "./icon";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <Button
      aria-label={`Aktifkan mode ${nextTheme === "dark" ? "gelap" : "terang"}`}
      iconOnly
      onClick={toggleTheme}
      title={`Aktifkan mode ${nextTheme === "dark" ? "gelap" : "terang"}`}
      variant="secondary"
    >
      <Icon name={theme === "light" ? "moon" : "sun"} size={18} />
    </Button>
  );
}
