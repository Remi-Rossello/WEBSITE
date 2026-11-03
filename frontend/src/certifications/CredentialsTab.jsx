import { useMemo, useState } from "react";
import { certificationItems, linkedInCertificationsUrl } from "./certificationItems";

function CredentialsTab() {
  const [selectedCertification, setSelectedCertification] = useState(null);
  const certificationSections = useMemo(() => ["Engineering", "Computer Science", "Other Courses"], []);
  const canShowVerificationLink =
    selectedCertification?.credentialUrl && selectedCertification.credentialUrl !== linkedInCertificationsUrl;
  const selectedLinkLabel = selectedCertification?.linkLabel || "Verify credential";

  return (
    <>
      <h1 className="content-title">Certifications</h1>

      {selectedCertification ? (
        <div className="certification-viewer">
          <button className="button button-secondary" type="button" onClick={() => setSelectedCertification(null)}>
             Back to grid
          </button>

          <div className="certification-viewer-head">
            {selectedCertification.logoUrl && (
              <img className="certification-logo" src={selectedCertification.logoUrl} alt={selectedCertification.issuer} />
            )}
            <div>
              <h2>{selectedCertification.title}</h2>
              <p className="certification-issuer">{selectedCertification.issuer}</p>
              {selectedCertification.date && <p className="certification-date">{selectedCertification.date}</p>}
              {selectedCertification.credentialId && (
                <p className="certification-id">Credential ID: {selectedCertification.credentialId}</p>
              )}
            </div>
          </div>

          {selectedCertification.diplomaImage ? (
            <div className="certification-image-wrap">
              <img
                className="certification-image"
                src={selectedCertification.diplomaImage}
                alt={`${selectedCertification.title} diploma`}
              />

              {canShowVerificationLink && (
                <a
                  className="button button-secondary certification-link"
                  href={selectedCertification.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {selectedLinkLabel}
                </a>
              )}
            </div>
          ) : (
            canShowVerificationLink && (
              <a
                className="button button-secondary certification-link"
                href={selectedCertification.credentialUrl || linkedInCertificationsUrl}
                target="_blank"
                rel="noreferrer"
              >
                {selectedLinkLabel}
              </a>
            )
          )}
        </div>
      ) : certificationItems.length === 0 ? (
        <p className="subtitle certifications-empty">
          LinkedIn blocks automated extraction here. Share your certification list and I can populate this grid instantly.
        </p>
      ) : (
        <div className="certifications-sections">
          {certificationSections.map((sectionTitle) => {
            const sectionItems = certificationItems.filter((certification) => certification.section === sectionTitle);
            if (sectionItems.length === 0) {
              return null;
            }

            return (
              <section className="certifications-section" key={sectionTitle} aria-label={sectionTitle}>
                <h2 className="certifications-section-title">{sectionTitle}</h2>
                <div className="certifications-grid" aria-label={`${sectionTitle} certifications`}>
                  {sectionItems.map((certification) => (
                    <button
                      className="certification-card certification-card-button"
                      key={`${certification.title}-${certification.issuer}`}
                      type="button"
                      onClick={() => setSelectedCertification(certification)}
                    >
                      <div className="certification-card-head">
                        {certification.logoUrl && (
                          <img className="certification-logo" src={certification.logoUrl} alt={certification.issuer} />
                        )}
                        <p className="certification-issuer">{certification.issuer}</p>
                      </div>
                      <h3 className="certification-title">{certification.title}</h3>
                      {certification.date && <p className="certification-date">{certification.date}</p>}
                      {certification.credentialId && <p className="certification-id">Credential ID: {certification.credentialId}</p>}
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}

export default CredentialsTab;
