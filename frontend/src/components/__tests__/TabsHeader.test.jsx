// This test verifies that TabsHeader renders branding/tabs and opens the contact panel when requested.
import { fireEvent, render, screen } from "@testing-library/react";
import TabsHeader from "../TabsHeader";

const tabs = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
];

describe("TabsHeader", () => {
  it("renders brand and tabs", () => {
    render(<TabsHeader tabs={tabs} activeTab="home" onTabChange={() => {}} />);
    expect(screen.getByText("Remi Rossello")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Rémi Rossello" })).toHaveAttribute("src", "/assets/images/profile-pic.png");
    expect(screen.getByRole("tab", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Projects" })).toBeInTheDocument();
  });

  it("opens contact panel", () => {
    render(<TabsHeader tabs={tabs} activeTab="home" onTabChange={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Contact" }));
    expect(screen.getByText("remi.rossello@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("+33 07 81 00 50 32")).toBeInTheDocument();
  });
});
