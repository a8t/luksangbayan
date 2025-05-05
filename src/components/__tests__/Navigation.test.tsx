import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Navigation from "../Navigation";
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Navigation", () => {
  it("renders all navigation links", () => {
    render(<Navigation />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Memorial Wall")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("renders the share button", () => {
    render(<Navigation />);
    expect(screen.getByLabelText(/share this site/i)).toBeInTheDocument();
  });

  it("opens the share modal when share button is clicked", () => {
    render(<Navigation />);
    fireEvent.click(screen.getByLabelText(/share this site/i));
    expect(screen.getByText(/share luksang bayan/i)).toBeInTheDocument();
  });
});
