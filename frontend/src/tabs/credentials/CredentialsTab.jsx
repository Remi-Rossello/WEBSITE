import { useState } from "react";
import { certificationItems, linkedInCertificationsUrl } from "./certificationItems";

function CredentialsTab({ onDetailChange }) {
  const [selectedCertification, setSelectedCertification] = useState(null);

  const selectCertification = (cert) => {
    setSelectedCertification(cert);
    onDetailChange?.(cert !== null);
  };
  const certificationSections = ["Computer Science", "Engineering", "Other Courses"];
  const canShowVerificationLink =
    selectedCertification?.credentialUrl && selectedCertification.credentialUrl !== linkedInCertificationsUrl;
  const selectedLinkLabel = selectedCertification?.linkLabel || "Link";

  return (
    <section id="panel-certifications" role="tabpanel" aria-labelledby="tab-certifications">

      {selectedCertification ? (
        <div className="certification-viewer">
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
              <div className="certification-nav">
                <button className="button button-secondary" type="button" onClick={() => selectCertification(null)}>
                  ← Go back
                </button>
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
              <img
                className="certification-image"
                src={selectedCertification.diplomaImage}
                alt={`${selectedCertification.title} diploma`}
              />
            </div>
          ) : (
            <div className="certification-nav">
              <button className="button button-secondary" type="button" onClick={() => selectCertification(null)}>
                ← Go back
              </button>
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
          )}
        </div>
      ) : certificationItems.length === 0 ? (
        <>
          <h1 className="content-title">Certifications</h1>
          <p className="subtitle certifications-empty">
            LinkedIn blocks automated extraction here. Share your certification list and I can populate this grid instantly.
          </p>
        </>
      ) : (
        <>
          <h1 className="content-title">Certifications</h1>
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
                      onClick={() => selectCertification(certification)}
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
        </>
      )}
    </section>
  );
}

export default CredentialsTab;
