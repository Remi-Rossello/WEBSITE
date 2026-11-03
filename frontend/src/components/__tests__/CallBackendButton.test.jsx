// This test verifies that CallBackendButton sends drawn grid data and displays prediction or fallback states.
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import DigitRecognizerPanel from "../../projects/digit-recognizer/DigitRecognizerPanel";

describe("DigitRecognizerPanel", () => {
  it("shows only the frontend and backend in the architecture diagram", () => {
    const { container } = render(<DigitRecognizerPanel />);

    expect(screen.getByRole("heading", { name: "How this demo is wired" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /frontend sends the digit grid.*runs the ONNX model/i })).toBeInTheDocument();
    expect(container.querySelectorAll(".backend-architecture-node")).toHaveLength(2);
    expect(screen.queryByText("Model source")).not.toBeInTheDocument();
    expect(screen.queryByText(/github-hosted ONNX weights/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/downloads model once/i)).not.toBeInTheDocument();
  });

  it("shows prediction on success", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ digit: 8, confidence: 0.92 }),
    });

    render(<DigitRecognizerPanel />);
    expect(screen.getByRole("heading", { name: "The Famous Digit AI" })).toBeInTheDocument();
    fireEvent.pointerDown(screen.getByLabelText("Cell 1"));
    fireEvent.pointerUp(screen.getByLabelText("Cell 1"));
    fireEvent.click(screen.getByRole("button", { name: /predict digit/i }));

    await waitFor(() => {
      expect(screen.getByText("8")).toBeInTheDocument();
      expect(screen.getByText(/confidence: 92%/i)).toBeInTheDocument();
    });

    const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(payload.grid).toHaveLength(28);
    expect(payload.grid.every((row) => row.length === 28)).toBe(true);
  });

  it("asks for drawing when trying to predict with an empty grid", async () => {
    render(<DigitRecognizerPanel />);
    fireEvent.click(screen.getByRole("button", { name: /predict digit/i }));

    await waitFor(() => {
      expect(screen.getByText(/draw a digit first/i)).toBeInTheDocument();
    });
  });

  it("shows fallback message on backend failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    render(<DigitRecognizerPanel />);
    fireEvent.pointerDown(screen.getByLabelText("Cell 1"));
    fireEvent.pointerUp(screen.getByLabelText("Cell 1"));
    fireEvent.click(screen.getByRole("button", { name: /predict digit/i }));

    await waitFor(() => {
      expect(screen.getByText("Prediction failed. Please retry.")).toBeInTheDocument();
    });
  });

  it("stops drawing after the pointer is released outside the grid", () => {
    render(<DigitRecognizerPanel />);

    const firstCell = screen.getByLabelText("Cell 1");
    const secondCell = screen.getByLabelText("Cell 2");
    const thirdCell = screen.getByLabelText("Cell 3");

    fireEvent.pointerDown(firstCell, { button: 0, buttons: 1 });
    fireEvent.pointerEnter(secondCell, { buttons: 1 });
    fireEvent.pointerUp(window);
    fireEvent.pointerEnter(thirdCell, { buttons: 0 });

    expect(firstCell).toHaveAttribute("aria-pressed", "true");
    expect(secondCell).toHaveAttribute("aria-pressed", "true");
    expect(thirdCell).toHaveAttribute("aria-pressed", "false");
  });
});
