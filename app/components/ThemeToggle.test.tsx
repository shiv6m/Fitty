import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ThemeToggle from "./ThemeToggle";

describe("ThemeToggle smoke test", () => {
  it("starts in light mode and toggles dark, persisting the choice", () => {
    render(<ThemeToggle />);
    expect(screen.getByText("Light mode")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Dark mode")).toBeInTheDocument();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("reads the dark class the pre-hydration script already set", () => {
    document.documentElement.classList.add("dark");
    render(<ThemeToggle />);
    expect(screen.getByText("Dark mode")).toBeInTheDocument();
  });
});
