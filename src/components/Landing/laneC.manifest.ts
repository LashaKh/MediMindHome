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
          map.set(e.id, { alt: e.alt, width: e.width, height: e.height, fallback: e.fallback, avif: e.avif, webp: e.webp });
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

export function useLandingManifest(): ManifestMap {
  const [map, setMap] = useState<ManifestMap>(() => loaded ?? EMPTY);
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
