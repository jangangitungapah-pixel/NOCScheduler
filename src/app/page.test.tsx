import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("engineering baseline page", () => {
  it("renders the application identity and phase marker", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: "NOCScheduler" })).toBeInTheDocument();
    expect(screen.getByText("WP-F00 Engineering Baseline")).toBeInTheDocument();
  });
});
