// This test verifies that the App renders the home screen and navigates to the backend demo card.
import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import App from "./App";

vi.mock("./projects/lagrangian/LagrangianPanel", () => ({
  default: () => <div>Lagrangian Panel Mock</div>,
}));

vi.mock("./projects/digit-recognizer/DigitRecognizerPanel", () => ({
  default: () => <div>Digit Recognizer Panel Mock</div>,
}));

vi.mock("./projects/dino/DinoSkillPanel", () => ({
  default: () => <div>Dino Skill Panel Mock</div>,
}));

vi.mock("./projects/publications/PublicationPanel", () => ({
  default: ({ publicationId }) => <div>Publication Panel Mock: {publicationId}</div>,
}));

vi.mock("react-katex", () => ({
  InlineMath: ({ math }) => <span>{math}</span>,
  BlockMath: ({ math }) => <div>{math}</div>,
}));

describe("App", () => {
  it("moves the timeline at the reduced speeds and restores its default on mouse leave", () => {
    let frame;
    const requestFrame = vi.spyOn(globalThis, "requestAnimationFrame").mockImplementation((callback) => {
      frame = callback;
      return 1;
    });
    const cancelFrame = vi.spyOn(globalThis, "cancelAnimationFrame").mockImplementation(() => {});
    window.history.replaceState(null, "", "#home");
    const { container, unmount } = render(<App />);
    try {
      const ticker = container.querySelector(".news-ticker-inner");
      const track = container.querySelector(".news-ticker-track");
      Object.defineProperty(ticker, "scrollWidth", { value: 4000 });
      vi.spyOn(track, "getBoundingClientRect").mockReturnValue({ left: 0, width: 100 });

      frame(1000);
      frame(2000);
      expect(ticker.style.transform).toBe("translateX(-32px)");

      fireEvent.mouseMove(track, { clientX: 100 });
      frame(3000);
      expect(ticker.style.transform).toBe("translateX(-192px)");

      fireEvent.mouseMove(track, { clientX: 50 });
      frame(4000);
      expect(ticker.style.transform).toBe("translateX(-192px)");

      fireEvent.mouseMove(track, { clientX: 0 });
      frame(5000);
      expect(ticker.style.transform).toBe("translateX(-32px)");

      fireEvent.mouseLeave(track);
      frame(6000);
      frame(7000);
      expect(ticker.style.transform).toBe("translateX(-64px)");
    } finally {
      unmount();
      requestFrame.mockRestore();
      cancelFrame.mockRestore();
    }
  });

  it("registers visits without showing the counter", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ visits: 42 }),
    });
    try {
      window.history.replaceState(null, "", "#home");
      render(<App />);

      await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/visits$/),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ deviceId: localStorage.getItem("visitor_id") }),
        }),
      ));
      await waitFor(() => expect(screen.getByText("42 unique browsers have visited this website !")).not.toBeVisible());
      expect(screen.queryByText("Live visitor counter")).not.toBeInTheDocument();
    } finally {
      fetchMock.mockRestore();
    }
  });

  it("places Certifications after Projects and preserves the Other Courses entries", async () => {
    window.history.replaceState(null, "", "#projects");
    render(<App />);

    expect(screen.getAllByRole("tab").map((tab) => tab.textContent)).toEqual([
      "Home", "About", "Projects", "Certifications",
    ]);
    fireEvent.keyDown(screen.getByRole("tab", { name: "Projects" }), { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Certifications" })).toHaveAttribute("aria-selected", "true");
    expect(await screen.findByRole("heading", { name: "Certifications" })).toBeInTheDocument();
    expect(window.location.hash).toBe("#certifications");
    const otherCourses = within(screen.getByRole("region", { name: "Other Courses" }));
    expect(otherCourses.getByRole("heading", { name: "Other Courses" })).toBeInTheDocument();
    expect(otherCourses.getByRole("heading", { name: "IELTS - C1 level" })).toBeInTheDocument();
    expect(otherCourses.getByRole("heading", { name: "Greek and Roman Mythology MOOC" })).toBeInTheDocument();
    expect(otherCourses.getByRole("heading", { name: "Human Behavioral Biology (2010 Lecture Series)" })).toBeInTheDocument();
    expect(otherCourses.getByRole("heading", { name: "MOOC Gestion de Projet, Attestation session 18 Parcours Classique" })).toBeInTheDocument();
    fireEvent.click(otherCourses.getByRole("button", { name: /IELTS - C1 level/i }));
    expect(screen.getByRole("heading", { name: "IELTS - C1 level" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /go back/i }));
    expect(screen.getByRole("region", { name: "Other Courses" })).toBeInTheDocument();
  });

  it("introduces Rémi and displays the featured projects on the home page", async () => {
    window.history.replaceState(null, "", "#home");
    render(<App />);

    expect(screen.getByRole("heading", { level: 1, name: "Welcome!" })).toBeInTheDocument();
    const introduction = screen.getByText("Hi, I'm Rémi Rossello, a software engineer with an engineering background from Mines Nancy. I enjoy building software, exploring AI, and understanding how things work under the hood.");
    expect(introduction).toBeInTheDocument();
    expect(introduction.textContent).toContain("Mines\u00a0Nancy");
    expect(document.querySelector(".home-intro strong")).not.toBeInTheDocument();
    expect(screen.getByText("Here you'll find a selection of my projects, scientific publications related to computer science, and certifications.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Featured projects" })).toBeInTheDocument();
    const featured = within(screen.getByRole("region", { name: "Featured projects" }));
    expect(featured.getByRole("button", { name: /The Famous Digit AI/i })).toBeInTheDocument();
    expect(featured.getByRole("button", { name: /Agent Skill: Dino Game/i })).toBeInTheDocument();
    expect(featured.getByRole("button", { name: /Published.*Publication: Spectral Analysis Algorithm/i })).toBeInTheDocument();
    expect(featured.queryByRole("button", { name: /Guide to Computers/i })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Timeline")).toBeInTheDocument();
    expect(screen.getByText("TIMELINE")).toBeInTheDocument();
    expect(document.querySelector(".news-ticker-dot")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /see all projects/i }));
    expect(screen.getByRole("tab", { name: "Projects" })).toHaveAttribute("aria-selected", "true");
    expect(await screen.findByRole("heading", { name: "The Famous Digit AI" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Publication: Spectral Analysis Algorithm" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Guide to Computers: From Transistors to Pixels" })).toBeInTheDocument();
  });

  it.each([
    ["The Famous Digit AI", "backend-test", /digit recognizer panel mock/i],
    ["Agent Skill: Dino Game", "dino-skill", /dino skill panel mock/i],
    ["Publication: Spectral Analysis Algorithm", "publication-lunar-geology", /Publication Panel Mock: publication-lunar-geology/],
  ])("opens featured project %s from Home", async (title, id, panelText) => {
    window.history.replaceState(null, "", "#home");
    render(<App />);

    const featured = within(screen.getByRole("region", { name: "Featured projects" }));
    fireEvent.click(featured.getByRole("button", { name: new RegExp(title, "i") }));
    expect(await screen.findByText(panelText)).toBeInTheDocument();
    await waitFor(() => expect(window.location.hash).toBe(`#projects/${id}`));
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

  it("shows the updated About introduction", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("tab", { name: "About" }));

    const heading = screen.getByRole("heading", { name: "Hi!" });
    expect(heading.nextElementSibling.textContent.replace(/\s+/g, " ").trim()).toBe(
      "I'm Rémi Rossello, a software engineer with a background in materials science and engineering, and a graduate of Mines Nancy in France. Having developed my full-stack skills through independent learning and hands-on experience, I'm looking to pursue my career in software engineering, particularly on projects involving AI, an area in which I've gained practical experience.",
    );
    expect(heading.nextElementSibling.nextElementSibling).toHaveTextContent("Professional experiences");
  });

  it("shows professional experiences with the requested emphasis", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("tab", { name: "About" }));

    const heading = screen.getByRole("heading", { name: "Professional experiences" });
    const expected = [
      [["OffWorld", "Cosmochemistry and Planetology team at CRPG"], "After graduating in 2024, I joined OffWorld, a space technology startup based in Luxembourg, where I worked on engineering challenges related to lunar resource extraction. I combined materials science and programming to contribute to ESA-sponsored experiments. I then joined the Cosmochemistry and Planetology team at CRPG, where I developed IDL scripts for the spectral identification of lunar minerals, contributing to scientific work presented at the European Lunar Symposium 2025."],
      [["Histia", "Mathematics Expert at Scale AI"], "More recently, I worked with Histia, an AI startup, developing an agentic system designed to extract structured information from web and local sources. I worked on backend development, automated testing, benchmarking and application integration, using technologies such as Python, FastAPI, PostgreSQL, RabbitMQ, Docker and LLM APIs. I also work as a Mathematics Expert at Scale AI, contributing to the creation and evaluation of mathematical problems for LLM training."],
    ];
    let paragraph = heading.nextElementSibling;
    for (const [emphasis, text] of expected) {
      expect(paragraph.tagName).toBe("P");
      expect(paragraph.textContent.replace(/\s+/g, " ").trim()).toBe(text);
      expect(Array.from(paragraph.querySelectorAll("strong"), (element) => element.textContent)).toEqual(emphasis);
      paragraph = paragraph.nextElementSibling;
    }
    expect(paragraph).toHaveTextContent("My Journey into Computer Science");
  });

  it("shows the updated computer science journey", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("tab", { name: "About" }));

    const heading = screen.getByRole("heading", { name: "My Journey into Computer Science" });
    const expected = [
      "My interest in computing goes beyond writing code. I wanted to understand what actually happens inside a computer. I started with NandGame, building a computer from scratch, from logic gates and memory circuits to a CPU capable of executing machine instructions. This led me to explore Assembly, C, Linux and operating systems, notably through Operating Systems: Three Easy Pieces.",
      "Alongside my engineering studies, I progressively developed my software skills through hands-on projects and independent learning, exploring Python, JavaScript, TypeScript, React, Node.js, SQL and full-stack development. I believe that understanding the fundamentals makes you a better engineer, and I enjoy continuously expanding my knowledge through building things.",
    ];
    let paragraph = heading.nextElementSibling;
    for (const text of expected) {
      expect(paragraph.tagName).toBe("P");
      expect(paragraph.textContent.replace(/\s+/g, " ").trim()).toBe(text);
      paragraph = paragraph.nextElementSibling;
    }
    expect(screen.getByText("Operating Systems: Three Easy Pieces").tagName).toBe("EM");
    expect(paragraph).toHaveTextContent("What's Next?");
  });

  it("shows the updated opportunities and contact section", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("tab", { name: "About" }));

    const heading = screen.getByRole("heading", { name: "What's Next?" });
    const opportunities = heading.nextElementSibling;
    const contact = opportunities.nextElementSibling;
    expect(opportunities.textContent.replace(/\s+/g, " ").trim()).toBe(
      "I'm currently looking for new opportunities as a Software Engineer, where I can contribute to building useful software, take on challenging technical problems and continue growing alongside an engineering team.",
    );
    expect(opportunities.querySelector("strong")).toHaveTextContent("Software Engineer");
    expect(contact.textContent.replace(/\s+/g, " ").trim()).toBe(
      "Feel free to reach out via LinkedIn or email at remi.rossello@gmail.com.",
    );
    expect(contact.querySelector('a[href="https://www.linkedin.com/in/remi-rossello/"]')).toHaveTextContent("LinkedIn");
    expect(contact.querySelector('a[href="mailto:remi.rossello@gmail.com"]')).toHaveTextContent("remi.rossello@gmail.com");
  });
});
