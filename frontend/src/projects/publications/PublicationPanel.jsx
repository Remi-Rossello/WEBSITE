import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import spintronicsPdf from "./assets/Alexandra_lepage_remi_rossello_DMI.pdf";
import lunarGeologyPdf from "./assets/ELS_Flahautv3.pdf";
import spectroscopyPdf from "./assets/Raman_vs_FTIR_Remi_Rossello.pdf";
import "./publications.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

const publications = {
  "publication-spintronics": {
    title: "Spintronics: Intro to DM effect",
    summary:
      "Friendly introduction to the Dzyaloshinkii-Moriya effect, magnetic skyrmions, and potential applications in spintronics. Written in French with co-author Alexandra Lepage.",
    pdfUrl: spintronicsPdf,
  },
  "publication-spectroscopy": {
    title: "Spectroscopy:Raman vs FTIR",
    summary:
      "General overview of two common optical spectroscopy techniques: Raman spectroscopy, and Fourier-transform infrared spectroscopy (FTIR).",
    pdfUrl: spectroscopyPdf,
  },
  "publication-lunar-geology": {
    title: "Publication: Spectral Analysis Algorithm",
    summary:
      "In this scientific proceeding published at the European Lunar Symposium 2025 in Munster, Germany, planetary geologist Jessica Flahaut uses my IDL lunar multispectral camera simulation, and automatic mineral classification scripts, to see if useful insights could be extracted with these techniques, and the future CNES lunar rover using them.",
    sourceUrl: "https://zenodo.org/records/15470779",
    pdfUrl: lunarGeologyPdf,
  },
};

/**
 * Displays a publication with summary, actions, and paginated PDF preview.
 * @param {object} props Component props.
 * @param {string} props.publicationId Publication identifier.
 * @returns {JSX.Element} Publication panel.
 */
function PublicationPanel({ publicationId, onBack }) {
  const publication = publications[publicationId];
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  if (!publication) {
    return null;
  }

  const { title, summary, sourceUrl, pdfUrl } = publication;

  useEffect(() => {
    setPage(1);
    setNumPages(null);
    setIsPreviewVisible(false);
  }, [pdfUrl]);

  /**
    * Syncs total page count and clamps current page after PDF load.
    * @param {{ numPages: number }} payload Loaded document metadata.
   * @returns {void}
   */
  const handleDocumentLoad = ({ numPages: totalPages }) => {
    setNumPages(totalPages);
    setPage((currentPage) => Math.min(currentPage, totalPages));
  };

  /**
    * Renders page navigation controls for the PDF.
    * @param {string} [className=""] Additional CSS class.
    * @returns {JSX.Element} Pagination controls.
   */
  const renderPageControls = (className = "") => (
    <div className={`publication-page-controls ${className}`.trim()} role="group" aria-label="PDF page controls">
      <button
        className="button button-secondary publication-page-button"
        type="button"
        disabled={page <= 1}
        onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
        aria-label="Previous page"
      >
        ←
      </button>
      <span className="publication-page-indicator" aria-live="polite">Page {page}{numPages ? ` / ${numPages}` : ""}</span>
      <button
        className="button button-secondary publication-page-button"
        type="button"
        disabled={Boolean(numPages && page >= numPages)}
        onClick={() => setPage((currentPage) => currentPage + 1)}
        aria-label="Next page"
      >
        →
      </button>
    </div>
  );

  return (
    <section className="project-panel publication-panel" aria-label={title}>
      <h1 className="content-title">{title}</h1>
      <div className="project-detail-toolbar">
        <button className="button button-secondary" type="button" onClick={onBack}>← Go back</button>
      </div>

      <div className="project-intro">
        <p className="project-body-text">{summary}</p>
      </div>

      {sourceUrl && (
        <div className="project-tree-box publication-source-box">
          <p className="project-tree-title">Source</p>
          <a className="button button-secondary" href={sourceUrl} target="_blank" rel="noreferrer">
            Open source
          </a>
        </div>
      )}

      <div className="project-content publication-media-box">
        <div className="publication-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={() => setIsPreviewVisible((visible) => !visible)}
            aria-expanded={isPreviewVisible}
            aria-controls="publication-preview"
          >
            {isPreviewVisible ? "Hide preview" : "Preview"}
          </button>
          <a className="button button-secondary" href={pdfUrl} target="_blank" rel="noreferrer">
            Open PDF in new tab
          </a>
          <a className="button button-secondary" href={pdfUrl} download>
            Download
          </a>
        </div>

        {isPreviewVisible && (
          <>
            {renderPageControls()}

            <div className="publication-document-wrap" id="publication-preview">
              <Document
                className="publication-document"
                file={pdfUrl}
                onLoadSuccess={handleDocumentLoad}
                loading={<p className="project-loading">Loading PDF...</p>}
                error={<p className="project-loading">Failed to load PDF.</p>}
              >
                <Page className="publication-page" pageNumber={page} renderAnnotationLayer={false} renderTextLayer={false} />
              </Document>
            </div>

            {renderPageControls("publication-page-controls-bottom")}
          </>
        )}
      </div>
    </section>
  );
}

export default PublicationPanel;
