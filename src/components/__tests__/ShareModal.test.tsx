import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ShareModal from "../ShareModal";

describe("ShareModal", () => {
  it("does not render when open is false", () => {
    const { container } = render(
      <ShareModal open={false} onClose={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders when open is true", () => {
    render(<ShareModal open={true} onClose={() => {}} />);
    expect(screen.getByText(/share luksang bayan/i)).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(<ShareModal open={true} onClose={handleClose} />);
    fireEvent.click(screen.getByLabelText(/close share modal/i));
    expect(handleClose).toHaveBeenCalled();
  });
});
