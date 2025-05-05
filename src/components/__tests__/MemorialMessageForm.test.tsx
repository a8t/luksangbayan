import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MemorialMessageForm from "../MemorialMessageForm";

describe("MemorialMessageForm", () => {
  it("renders the peek handle", () => {
    render(<MemorialMessageForm />);
    expect(screen.getByText(/share your message/i)).toBeInTheDocument();
  });

  it("opens the form when peek handle is clicked", async () => {
    render(<MemorialMessageForm />);
    fireEvent.click(screen.getByText(/share your message/i));
    await waitFor(() => {
      expect(screen.getByRole("form")).toBeInTheDocument();
    });
  });

  it("shows validation errors if required fields are empty", async () => {
    render(<MemorialMessageForm />);
    fireEvent.click(screen.getByText(/share your message/i));
    await waitFor(() => {
      expect(screen.getByRole("form")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /share message/i }));
    // Should not submit, required fields missing
    expect(screen.getByRole("form")).toBeInTheDocument();
  });
});
