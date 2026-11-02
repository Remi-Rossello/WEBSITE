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

  it("shows the updated About introduction", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("tab", { name: "About" }));

    expect(screen.getByRole("heading", { name: "Hi!" })).toBeInTheDocument();
    expect(screen.getByText("I'm Rémi Rossello, a software engineer with a background in materials science and engineering, and a graduate of Mines Nancy in France.")).toBeInTheDocument();
    expect(screen.getByText("Having developed my full-stack skills through independent learning and hands-on experience, I'm looking to pursue my career in software engineering, particularly on projects involving AI, an area in which I've gained practical experience.")).toBeInTheDocument();
  });

  it("shows professional experiences with the requested emphasis", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("tab", { name: "About" }));

    const heading = screen.getByRole("heading", { name: "Professional experiences" });
    const expected = [
      ["OffWorld", "After graduating in 2024, I joined OffWorld, a space technology startup based in Luxembourg, where I worked on engineering challenges related to lunar resource extraction. I combined materials science and programming to contribute to ESA-sponsored experiments."],
      ["Cosmochemistry and Planetology team at CRPG", "I then joined the Cosmochemistry and Planetology team at CRPG, where I developed IDL scripts for the spectral identification of lunar minerals, contributing to scientific work presented at the European Lunar Symposium 2025."],
      ["Histia", "More recently, I worked with Histia, an AI startup, developing an agentic system designed to extract structured information from web and local sources. I worked on backend development, automated testing, benchmarking and application integration, using technologies such as Python, FastAPI, PostgreSQL, RabbitMQ, Docker and LLM APIs."],
      ["Mathematics Expert at Scale AI", "I also work as a Mathematics Expert at Scale AI, contributing to the creation and evaluation of mathematical problems for LLM training."],
    ];
    let paragraph = heading.nextElementSibling;
    for (const [emphasis, text] of expected) {
      expect(paragraph.tagName).toBe("P");
      expect(paragraph.textContent.replace(/\s+/g, " ").trim()).toBe(text);
      expect(paragraph.querySelector("strong")).toHaveTextContent(emphasis);
      paragraph = paragraph.nextElementSibling;
    }
    expect(paragraph).toHaveTextContent("My Journey into Computer Science");
  });

  it("shows the updated computer science journey", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("tab", { name: "About" }));

    const heading = screen.getByRole("heading", { name: "My Journey into Computer Science" });
    const expected = [
      "My interest in computing goes beyond writing code. I wanted to understand what actually happens inside a computer.",
      "I started with NandGame, building a computer from scratch, from logic gates and memory circuits to a CPU capable of executing machine instructions. This led me to explore Assembly, C, Linux and operating systems, notably through Operating Systems: Three Easy Pieces.",
      "Alongside my engineering studies, I progressively developed my software skills through hands-on projects and independent learning, exploring Python, JavaScript, TypeScript, React, Node.js, SQL and full-stack development.",
      "I believe that understanding the fundamentals makes you a better engineer, and I enjoy continuously expanding my knowledge through building things.",
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
