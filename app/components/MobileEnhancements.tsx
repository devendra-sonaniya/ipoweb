"use client";

import { useEffect, useState } from "react";

export default function MobileEnhancements() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "auto";
    }

    const updateVisibility = () => setVisible(window.scrollY > 500);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`mobile-scroll-top ${visible ? "mobile-scroll-top--visible" : ""}`}
    >
      ↑
    </button>
  );
}
