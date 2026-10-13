import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

// Stop the browser from restoring the old scroll position on reload / back.
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });

export default function ScrollToTop() {
  const { pathname } = useLocation();


  useLayoutEffect(() => {
    toTop();
  }, [pathname]);

  useEffect(() => {
    const id = requestAnimationFrame(toTop);
    window.addEventListener("load", toTop, { once: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("load", toTop);
    };
  }, []);

  return null;
}