import React, { useEffect, useMemo, useRef, useState } from "react";
import { type Account, STAGE_LABEL } from "../../data/crm";

interface Props {
  accounts: Account[];
  onOpen: (id: string) => void;
}

/** Where a record lives, in the words the tabs use. */
function whereLabel(a: Account): string {
  if (a.kind === "anchor") return "Anchor customer";
  if (a.kind === "target") return a.excluded ? "Target, bad fit" : "Target";
  return a.stage ? STAGE_LABEL[a.stage] : "Pipeline";
}

/** Top-bar search: type part of a hospital or person's name, press Enter to open it. "/" jumps here. */
export const QuickFind: React.FC<Props> = ({ accounts, onOpen }) => {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      e.preventDefault();
      input.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const q = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!q) return [];
    const text = (a: Account) =>
      [a.name, a.city, a.champion, a.buyer, a.connector].filter(Boolean).join(" ").toLowerCase();
    const startsWith = (a: Account) => (a.name.toLowerCase().startsWith(q) ? 0 : 1);
    return accounts
      .filter((a) => text(a).includes(q))
      .sort((a, b) => startsWith(a) - startsWith(b) || a.name.localeCompare(b.name))
      .slice(0, 8);
  }, [accounts, q]);

  const choose = (a: Account) => {
    setQuery("");
    input.current?.blur();
    onOpen(a.id);
  };
  const open = focused && q !== "";

  return (
    <div className="crm-find">
      <input
        ref={input}
        type="search"
        role="combobox"
        aria-label="Find a hospital or person"
        aria-expanded={open}
        aria-controls="crm-find-list"
        aria-autocomplete="list"
        aria-activedescendant={open && matches[active] ? `crm-find-${matches[active].id}` : undefined}
        placeholder="Find a hospital or person"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => Math.min(i + 1, Math.max(matches.length - 1, 0)));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter" && matches[active]) {
            e.preventDefault();
            choose(matches[active]);
          } else if (e.key === "Escape") {
            if (query) setQuery("");
            else input.current?.blur();
          }
        }}
      />
      {!focused && !query && <kbd className="crm-find-key" aria-hidden="true">/</kbd>}
      {open && (
        <div className="crm-find-pop">
          {matches.length === 0 ? (
            <p className="crm-find-empty">Nothing matches “{query.trim()}”.</p>
          ) : (
            <ul id="crm-find-list" role="listbox" aria-label="Matching hospitals">
              {matches.map((a, i) => (
                <li
                  key={a.id}
                  id={`crm-find-${a.id}`}
                  role="option"
                  aria-selected={i === active}
                  className={i === active ? "is-active" : ""}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    choose(a);
                  }}
                  onMouseEnter={() => setActive(i)}
                >
                  <span className="crm-find-name">{a.name}</span>
                  <span className="crm-find-where">
                    {whereLabel(a)}
                    {a.city ? `, ${a.city}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
