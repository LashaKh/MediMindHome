/**
 * Every presentation this deploy serves, in the order you'd reach for them.
 *
 * `gate` is what a viewer must type to get in — null means the link alone is
 * enough. deck.html is the odd one out: its password is per-investor and lives
 * in the invite table below the panel, so it carries a pointer instead of a
 * literal.
 *
 * Passwords are compared case-insensitively by their gates, but they're listed
 * here exactly as the deck spells them so what you paste matches what you say.
 */
export interface Deck {
  id: string;
  label: string;
  blurb: string;
  path: string;
  gate: string | null;
  /** true when `gate` points at the invite table rather than being the password */
  gatePerInvite?: boolean;
}

export const DECKS: Deck[] = [
  {
    id: "long",
    label: "Long version",
    blurb: "18 slides — the full story, promise through appendix",
    path: "/long.html",
    gate: null,
  },
  {
    id: "pitch",
    label: "Pitch",
    blurb: "Live-presentation deck, open by design",
    path: "/pitch.html",
    gate: null,
  },
  {
    id: "story",
    label: "Story",
    blurb: "Scrolling investor narrative, EN / KA",
    path: "/story.html",
    gate: null,
  },
  {
    id: "landing",
    label: "Landing page",
    blurb: "The public marketing site",
    path: "/",
    gate: null,
  },
  {
    id: "deck",
    label: "Investor deck",
    blurb: "Per-investor briefing, tracked",
    path: "/deck.html",
    gate: "per-invite — see the table below",
    gatePerInvite: true,
  },
  {
    id: "hospitals",
    label: "Hospitals",
    blurb: "Hospital partnership deck, EN / KA",
    path: "/hospitals.html",
    gate: "medimind",
  },
  {
    id: "healthycore",
    label: "Healthycore",
    blurb: "Partner proposal",
    path: "/healthycore.html",
    gate: "Healthycore",
  },
];
