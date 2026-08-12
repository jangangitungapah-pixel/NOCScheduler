import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { Button } from "./button";
import { Combobox } from "./fields";
import { ScheduleCell } from "./schedule";
import { SegmentedControl } from "./selection-controls";
import { ThemeProvider } from "./theme-provider";
import { ThemeToggle } from "./theme-toggle";

afterEach(() => {
  document.documentElement.dataset.theme = "light";
  window.localStorage.clear();
});

describe("design system behavior", () => {
  it("keeps loading button width content in the DOM while disabling interaction", () => {
    render(
      <Button loading variant="primary">
        Publikasikan
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Publikasikan" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("switches one component tree between light and dark themes", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: /aktifkan mode gelap/i }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem("nocscheduler.theme")).toBe("dark");
  });

  it("supports keyboard selection in combobox", async () => {
    const user = userEvent.setup();

    function Fixture() {
      const [value, setValue] = useState("budi");
      return (
        <Combobox
          label="Employee"
          onValueChange={setValue}
          options={[
            { value: "budi", label: "Budi" },
            { value: "dina", label: "Dina" },
          ]}
          value={value}
        />
      );
    }

    render(<Fixture />);
    const input = screen.getByRole("combobox", { name: "Employee" });
    await user.click(input);
    await user.keyboard("{ArrowDown}{Enter}");
    expect(input).toHaveValue("Dina");
  });

  it("uses roving keyboard focus for segmented controls", async () => {
    const user = userEvent.setup();

    function Fixture() {
      const [value, setValue] = useState<"month" | "week">("month");
      return (
        <SegmentedControl
          ariaLabel="View"
          onValueChange={setValue}
          options={[
            { value: "month", label: "Month" },
            { value: "week", label: "Week" },
          ]}
          value={value}
        />
      );
    }

    render(<Fixture />);
    const month = screen.getByRole("radio", { name: "Month" });
    month.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Week" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Week" })).toHaveFocus();
  });

  it("keeps OFF visually distinct from an unassigned schedule cell", () => {
    const { rerender } = render(<ScheduleCell assignment="OFF" />);
    expect(screen.getByText("OFF")).toBeInTheDocument();
    expect(screen.queryByText("Belum diisi")).not.toBeInTheDocument();

    rerender(<ScheduleCell assignment="UNASSIGNED" />);
    expect(screen.getByText("Belum diisi")).toBeInTheDocument();
  });
});
