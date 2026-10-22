import { useEffect, useRef } from "react";

// Open layers in the order they opened. Escape only reaches the newest one, so it closes
// a small form inside the drawer before the drawer, and never a layer hidden behind a dialog.
const layers: number[] = [];
let nextLayer = 0;

/** Run `handler` when Escape is pressed (while `active`) and this is the top open layer. */
export function useEscape(handler: () => void, active = true): void {
  const latest = useRef(handler);
  latest.current = handler;
  useEffect(() => {
    if (!active) return;
    const id = ++nextLayer;
    layers.push(id);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && layers[layers.length - 1] === id) latest.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      layers.splice(layers.indexOf(id), 1);
    };
  }, [active]);
}
