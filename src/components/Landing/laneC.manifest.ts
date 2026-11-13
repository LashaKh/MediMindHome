import { useEffect, useState } from 'react';
import type { ResponsiveImage } from '../../content/types';

/**
 * Lane C helper: reads public/landing/manifest.json once at runtime so a
 * screen's night twin (`<id>-dark`) and the hospital brain captures
 * (`brain-*`) light up as soon as they exist, without a code change.
 * Until the manifest arrives (or if it fails), callers fall back to the
 * light screens they already know.
 */

interface ManifestEntry {
  id: string;
  alt: string;
  width: number;
  height: number;
  fallback: string;
  avif?: string;
  webp?: string;
}

export type ManifestMap = ReadonlyMap<string, ResponsiveImage>;

const EMPTY: ManifestMap = new Map();
/** Before the manifest has answered: night mode waits so a light screen is not fetched and then swapped. */
const PENDING: ManifestMap = new Map();
export const isPending = (map: ManifestMap) => map === PENDING;
let pending: Promise<ManifestMap> | null = null;
let loaded: ManifestMap | null = null;

function load(): Promise<ManifestMap> {
  if (!pending) {
    pending = fetch('/landing/manifest.json', { cache: 'no-cache' })
      .then((res) => (res.ok ? res.json() : { images: [] }))
      .then((data: { images?: ManifestEntry[] }) => {
        const map = new Map<string, ResponsiveImage>();
        for (const e of data.images ?? []) {
          if (!e?.id || !e.fallback || !e.width || !e.height) continue;
          map.set(e.id, {
            alt: e.alt,
            width: e.width,
            height: e.height,
            fallback: e.fallback,
            avif: e.avif,
            webp: e.webp,
          });
        }
        loaded = map;
        return map;
      })
      .catch((err: unknown) => {
        // The page still works with the light screens built into the content file.
        console.warn('[landing] manifest.json not readable; night screens and brain captures stay hidden', err);
        loaded = EMPTY;
        return EMPTY;
      });
  }
  return pending;
}

/** True while the page is in night mode (`dark` on <html>), following the header toggle live. */
export function useIsDark(): boolean {
  const read = () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const [dark, setDark] = useState(read);
  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => setDark(root.classList.contains('dark')));
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    setDark(root.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);
  return dark;
}

/** True while the viewport is at least `px` wide, so only the layout in view loads its screens. */
export function useMinWidth(px: number): boolean {
  const query = `(min-width: ${px}px)`;
  const [match, setMatch] = useState(
    () => typeof window !== 'undefined' && Boolean(window.matchMedia?.(query).matches),
  );
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

export function useLandingManifest(): ManifestMap {
  const [map, setMap] = useState<ManifestMap>(() => loaded ?? PENDING);
  useEffect(() => {
    let live = true;
    load().then((m) => {
      if (live) setMap(m);
    });
    return () => {
      live = false;
    };
  }, []);
  return map;
}
