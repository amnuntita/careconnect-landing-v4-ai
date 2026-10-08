"use client";

import { useEffect } from "react";

// Closes the open <details data-nav-menu> on Escape, on a click outside it,
// or after a link inside it is followed. Menus work without JS; this only
// adds the expected dismiss behaviour.
export function NavMenuCloser() {
  useEffect(() => {
    const openMenus = () =>
      Array.from(document.querySelectorAll<HTMLDetailsElement>("details[data-nav-menu][open]"));
    const onClick = (e: MouseEvent) => {
      for (const menu of openMenus()) {
        const target = e.target as Node;
        if (!menu.contains(target) || (target instanceof Element && target.closest("a"))) {
          menu.open = false;
        }
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      for (const menu of openMenus()) {
        menu.open = false;
        menu.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  return null;
}
