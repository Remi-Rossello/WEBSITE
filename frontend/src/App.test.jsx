// This test verifies that the App renders the home screen and navigates to the backend demo card.
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

vi.mock("./projects/lagrangian/LagrangianPanel", () => ({
  default: () => <div>Lagrangian Panel Mock</div>,
}));

vi.mock("./projects/digit-recognizer/DigitRecognizerPanel", () => ({
  default: () => <div>Digit Recognizer Panel Mock</div>,
}));

vi.mock("react-katex", () => ({
  InlineMath: ({ math }) => <span>{math}</span>,
  BlockMath: ({ math }) => <div>{math}</div>,
}));

describe("App", () => {
  it("renders home view and opens the digit recognizer project from the home cards", async () => {
    render(<App />);

    expect(screen.getByText(/welcome to my website/i)).toBeInTheDocument();
    const digitRecognizerCard = screen.getByText(/digit recognizer/i).closest("button");
    expect(digitRecognizerCard).not.toBeNull();
    fireEvent.click(digitRecognizerCard);

    expect(await screen.findByText(/digit recognizer panel mock/i)).toBeInTheDocument();
  });

  it("shows only the software CV in About with matching preview and links", () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole("tab", { name: "About" }));

    const pdfUrl = "/assets/docs/Rossello_CV_Software_v2.pdf";
    expect(screen.getByText("Software CV")).toBeInTheDocument();
    expect(screen.queryByText(/materials.*cv/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("tablist", { name: "CV selector" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open" })).toHaveAttribute("href", pdfUrl);
    expect(screen.getByRole("link", { name: "Download" })).toHaveAttribute("href", pdfUrl);
    expect(container.querySelector("embed.about-pdf-frame")).toHaveAttribute(
      "src",
      `${pdfUrl}#view=FitH&zoom=page-width&toolbar=0&navpanes=0`,
    );
  });
});
