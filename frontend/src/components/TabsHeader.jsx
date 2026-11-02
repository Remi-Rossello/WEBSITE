import { useEffect, useRef, useState } from "react";
import TabButton from "./TabButton";

/**
 * Renders the navigation header with tabs, theme switch, and contact panel.
 * @param {object} props Component props.
 * @param {{id: string, label: string}[]} props.tabs Tab list.
 * @param {string} props.activeTab Active tab identifier.
 * @param {(tabId: string) => void} props.onTabChange Tab change callback.
 * @returns {JSX.Element} Tabs header.
 */
function TabsHeader({ tabs, activeTab, onTabChange }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const contactPanelRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  /**
    * Toggles between light and dark themes.
   * @returns {void}
   */
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  /**
   * Enables left/right keyboard navigation inside the main tabs.
   * @param {React.KeyboardEvent<HTMLElement>} event Keyboard event.
   * @returns {void}
   */
  const handleTabsKeyDown = (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }

    event.preventDefault();
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex === -1) {
      return;
    }

    const delta = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + delta + tabs.length) % tabs.length;
    onTabChange(tabs[nextIndex].id);
  };

  useEffect(() => {
    if (!isContactOpen) {
      return;
    }

    /**
      * Closes the contact panel when Escape is pressed.
      * @param {KeyboardEvent} event Global keyboard event.
     * @returns {void}
     */
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsContactOpen(false);
      }
    };

    /**
      * Closes the contact panel when clicking outside.
      * @param {MouseEvent} event Global mouse event.
     * @returns {void}
     */
    const handleOutsideClick = (event) => {
      if (contactPanelRef.current && !contactPanelRef.current.contains(event.target)) {
        setIsContactOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isContactOpen]);

  return (
    <header className="tabs-shell">
      <div className="tabs-header">
        <div className="header-brand" aria-label="Brand">
          <img className="brand-mark" src="/assets/images/profile-pic.png" alt="Rémi Rossello" />
          <span className="brand-name">Remi Rossello</span>
        </div>

        <nav className="header-nav" aria-label="Main tabs" role="tablist" onKeyDown={handleTabsKeyDown}>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              id={`tab-${tab.id}`}
              controlsId={`panel-${tab.id}`}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
            />
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle theme"
            data-tooltip="toggle light/dark"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <a className="social-link" href="https://github.com/Remi-Rossello" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="social-link" href="https://www.linkedin.com/in/remi-rossello/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <button
            className="social-link contact-toggle"
            type="button"
            onClick={() => setIsContactOpen((open) => !open)}
            aria-expanded={isContactOpen}
            aria-controls="header-contact-card"
            aria-haspopup="dialog"
          >
            Contact
          </button>

          {isContactOpen && (
            <div id="header-contact-card" className="contact-card" role="dialog" aria-label="Contact details" ref={contactPanelRef}>
              <img className="contact-card-avatar" src="/assets/images/profile-pic.png" alt="Rémi Rossello" />
              <a className="contact-card-link" href="mailto:remi.rossello@gmail.com">
                remi.rossello@gmail.com
              </a>
              <a className="contact-card-link" href="tel:+33781005032">
                +33 07 81 00 50 32
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TabsHeader;