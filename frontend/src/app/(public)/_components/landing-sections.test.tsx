import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FeaturesGrid } from "./features-grid";
import { FinalCtaSection } from "./final-cta-section";
import { HeroSection } from "./hero-section";
import { HowItWorksSection } from "./how-it-works-section";
import { LandingFooter } from "./landing-footer";
import { LandingNavbar } from "./landing-navbar";
import { StatsBar } from "./stats-bar";

describe("LandingNavbar", () => {
  it("renders Langu-AI logo", () => {
    render(<LandingNavbar />);
    expect(screen.getByText("Langu-AI")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<LandingNavbar />);
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("How it works")).toBeInTheDocument();
    expect(screen.getByText("Exam Prep")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
  });

  it("renders sign in and get started buttons", () => {
    render(<LandingNavbar />);
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByText(/get started free/i)).toBeInTheDocument();
  });

  it("sign in links to /login", () => {
    render(<LandingNavbar />);
    const signIn = screen.getByText("Sign in").closest("a");
    expect(signIn).toHaveAttribute("href", "/login");
  });

  it("get started links to /register", () => {
    render(<LandingNavbar />);
    const getStarted = screen.getByText(/get started free/i).closest("a");
    expect(getStarted).toHaveAttribute("href", "/register");
  });
});

describe("HeroSection", () => {
  it("renders hero headline", () => {
    const { container } = render(<HeroSection />);
    const h1 = container.querySelector("h1");
    expect(h1).toBeInTheDocument();
    expect(h1?.textContent).toContain("Your personal");
    expect(h1?.textContent).toContain("Powered by AI.");
  });

  it("renders eyebrow label", () => {
    render(<HeroSection />);
    expect(screen.getByText(/AI-Powered · Free Forever/)).toBeInTheDocument();
  });

  it("renders CTA buttons", () => {
    render(<HeroSection />);
    expect(screen.getByText(/start learning free/i)).toBeInTheDocument();
    expect(screen.getByText("See how it works")).toBeInTheDocument();
  });

  it("renders no-credit-card message", () => {
    render(<HeroSection />);
    expect(screen.getByText(/No credit card/)).toBeInTheDocument();
  });

  it("start learning links to /register", () => {
    render(<HeroSection />);
    const cta = screen.getByText(/start learning free/i).closest("a");
    expect(cta).toHaveAttribute("href", "/register");
  });
});

describe("StatsBar", () => {
  it("renders all 4 stats", () => {
    render(<StatsBar />);
    expect(screen.getByText("A1 – B2")).toBeInTheDocument();
    expect(screen.getByText("10,000+")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("renders stat labels", () => {
    render(<StatsBar />);
    expect(screen.getByText("All CEFR levels")).toBeInTheDocument();
    expect(screen.getByText("Vocabulary items")).toBeInTheDocument();
    expect(screen.getByText("Native languages")).toBeInTheDocument();
    expect(screen.getByText("Core content, always")).toBeInTheDocument();
  });
});

describe("FeaturesGrid", () => {
  it("renders section title", () => {
    render(<FeaturesGrid />);
    expect(screen.getByText(/Everything you need/)).toBeInTheDocument();
  });

  it("renders all 6 feature cards", () => {
    render(<FeaturesGrid />);
    expect(screen.getByText("AI-Generated Practice")).toBeInTheDocument();
    expect(screen.getByText("Gamified Learning")).toBeInTheDocument();
    expect(screen.getByText("Vocabulary Packs")).toBeInTheDocument();
    expect(screen.getByText("Official Exam Prep")).toBeInTheDocument();
    expect(screen.getByText("Grammar Tables")).toBeInTheDocument();
    expect(screen.getByText("Your Native Language")).toBeInTheDocument();
  });

  it("renders features section with id for anchor link", () => {
    const { container } = render(<FeaturesGrid />);
    expect(container.querySelector("#features")).toBeInTheDocument();
  });
});

describe("HowItWorksSection", () => {
  it("renders section headline", () => {
    render(<HowItWorksSection />);
    expect(screen.getByText("Three steps to fluency.")).toBeInTheDocument();
  });

  it("renders all 3 steps", () => {
    render(<HowItWorksSection />);
    expect(screen.getByText("Pick your pack")).toBeInTheDocument();
    expect(screen.getByText("Learn & practice")).toBeInTheDocument();
    expect(screen.getByText("Pass your exam")).toBeInTheDocument();
  });

  it("renders step numbers", () => {
    render(<HowItWorksSection />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});

describe("FinalCtaSection", () => {
  it("renders headline", () => {
    const { container } = render(<FinalCtaSection />);
    const h2 = container.querySelector("h2");
    expect(h2).toBeInTheDocument();
    expect(h2?.textContent).toContain("Start speaking German.");
    expect(h2?.textContent).toContain("Today. For free.");
  });

  it("renders CTA button linking to register", () => {
    render(<FinalCtaSection />);
    const cta = screen.getByText(/start learning/i).closest("a");
    expect(cta).toHaveAttribute("href", "/register");
  });
});

describe("LandingFooter", () => {
  it("renders Langu-AI branding", () => {
    render(<LandingFooter />);
    expect(screen.getByText("Langu-AI")).toBeInTheDocument();
  });

  it("renders copyright", () => {
    render(<LandingFooter />);
    expect(screen.getByText(/© 2026 Langu-AI/)).toBeInTheDocument();
  });
});
