import { Component, ReactNode } from "react";
import { FlowerIcon } from "@/components/FlowerIcon";

type Props = { children: ReactNode };
type State = { hasError: boolean };

const BOUQUET: { size: number; color: string; rotate: number }[] = [
  { size: 34, color: "#c5d07d", rotate: -12 },
  { size: 44, color: "#D08090", rotate: 6 },
  { size: 30, color: "#7A90C0", rotate: 18 },
  { size: 38, color: "#D4A070", rotate: -6 },
  { size: 28, color: "#A080B0", rotate: 10 },
];

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error("Uncaught render error:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        className="h-screen flex flex-col items-center justify-center text-center px-6 gap-5"
        style={{ backgroundColor: "#FAF7EF" }}
      >
        <div className="flex items-end gap-1.5">
          {BOUQUET.map((f, i) => (
            <div key={i} style={{ transform: `rotate(${f.rotate}deg)` }}>
              <FlowerIcon size={f.size} color={f.color} />
            </div>
          ))}
        </div>
        <div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "24px", color: "#2C2721", marginBottom: "6px" }}>
            Oops, you've reached a dead end
          </h1>
          <p style={{ fontSize: "14px", color: "#736959", maxWidth: 280, lineHeight: 1.6, margin: "0 auto" }}>
            Something went wrong on this page. Let's get you back to your garden.
          </p>
        </div>
        <button
          onClick={() => { window.location.href = "/garden"; }}
          className="h-12 px-6 rounded-full active:scale-95 transition-transform"
          style={{ backgroundColor: "#c5d07d", color: "#3D362D", fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "15px" }}
        >
          Go back to app
        </button>
      </div>
    );
  }
}
