import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import ProjectsOverview from "./ProjectsOverview";

it("shows one ordered grid with tags and opens every project", () => {
  const onSelectProject = vi.fn();
  render(<ProjectsOverview onSelectProject={onSelectProject} />);

  const expected = [
    ["The Famous Digit AI", "backend-test", ["Software", "AI"]],
    ["Agent Skill: Dino Game", "dino-skill", ["Software", "AI"]],
    ["Publication: Spectral Analysis Algorithm", "publication-lunar-geology", ["Publication", "Software", "Physics"]],
    ["Spintronics: Intro to DM effect", "publication-spintronics", ["Publication", "Physics"]],
    ["Spectroscopy:Raman vs FTIR", "publication-spectroscopy", ["Publication", "Physics"]],
    ["Lagrangian explorer", "lagrangian", ["Physics", "Software"]],
    ["Standard Model Explorer", "field-catalog", ["Physics", "Software"]],
    ["Guide to Computers: From Transistors to Pixels", "computer-roadmap", ["Computers", "Education"]],
  ];
  const cards = screen.getAllByRole("button");
  expect(cards).toHaveLength(expected.length);
  expect(screen.queryByRole("heading", { name: /^(Physics|Computers|Publications)$/ })).not.toBeInTheDocument();

  expected.forEach(([title, id, tags], index) => {
    const card = within(cards[index]);
    expect(card.getByRole("heading", { name: title })).toBeInTheDocument();
    tags.forEach((tag) => {
      expect(card.getByText(tag)).toBeInTheDocument();
      expect(cards[index]).toHaveAccessibleName(expect.stringContaining(tag));
    });
    fireEvent.click(cards[index]);
    expect(onSelectProject).toHaveBeenLastCalledWith(id);
  });
  expect(screen.getByText("Credit: Symmetry magazine")).toBeInTheDocument();
});
