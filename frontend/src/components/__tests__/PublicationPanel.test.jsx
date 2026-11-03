// This test verifies that PublicationPanel shows summary/source information and opens the PDF preview with pagination controls.
import { fireEvent, render, screen } from "@testing-library/react";
import PublicationPanel from "../../projects/publications/PublicationPanel";

vi.mock("react-pdf", async () => {
  const React = await import("react");

  return {
    pdfjs: { GlobalWorkerOptions: {} },
    Document: ({ children, onLoadSuccess }) => {
      React.useEffect(() => {
        onLoadSuccess?.({ numPages: 3 });
      }, [onLoadSuccess]);

      return <div data-testid="pdf-document">{children}</div>;
    },
    Page: ({ pageNumber }) => <div data-testid="pdf-page">Page {pageNumber}</div>,
  };
});

describe("PublicationPanel", () => {
  it("renders summary and optional source link", () => {
    render(<PublicationPanel publicationId="publication-lunar-geology" />);

    expect(screen.getByRole("heading", { name: "Publication: Spectral Analysis Algorithm" })).toBeInTheDocument();
    expect(screen.getByText(/planetary geologist jessica flahaut/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open source" })).toBeInTheDocument();
  });

  it("opens preview with page controls", () => {
    render(<PublicationPanel publicationId="publication-spectroscopy" />);

    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    expect(screen.getByTestId("pdf-document")).toBeInTheDocument();
    expect(screen.getAllByText(/Page 1 \/ 3/i).length).toBeGreaterThan(0);
  });
});
