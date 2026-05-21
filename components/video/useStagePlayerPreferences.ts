"use client";
import { useCallback, useEffect, useState } from "react";

const KEY = "west-peek-live-stage-player-preferences";

export interface StagePlayerPreferences {
  muted: boolean;
  volume: number;
  lastKnownStreamSource?: string;
}

function samePreferences(a: StagePlayerPreferences, b: StagePlayerPreferences) {
  return a.muted === b.muted && a.volume === b.volume && a.lastKnownStreamSource === b.lastKnownStreamSource;
}

export function useStagePlayerPreferences(defaultMuted = false) {
  const [preferences, setPreferences] = useState<StagePlayerPreferences>({
    muted: defaultMuted,
    volume: defaultMuted ? 0 : 0.7,
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      const stored = raw ? JSON.parse(raw) : {};
      setPreferences((current) => {
        const next = {
          ...current,
          ...stored,
          muted: stored.muted ?? defaultMuted,
          volume: stored.volume ?? (defaultMuted ? 0 : current.volume),
        };
        return samePreferences(current, next) ? current : next;
      });
    } catch {
      setPreferences((current) => {
        const next = { ...current, muted: defaultMuted };
        return samePreferences(current, next) ? current : next;
      });
    }
  }, [defaultMuted]);

  const save = useCallback((updater: (current: StagePlayerPreferences) => StagePlayerPreferences) => {
    setPreferences((current) => {
      const next = updater(current);
      if (samePreferences(current, next)) return current;
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    save((current) => ({
      ...current,
      muted,
      volume: muted ? 0 : Math.max(current.volume, 0.5),
    }));
  }, [save]);

  const setVolume = useCallback((volume: number) => {
    save((current) => ({
      ...current,
      volume,
      muted: volume <= 0,
    }));
  }, [save]);

  const rememberSource = useCallback((lastKnownStreamSource: string) => {
    save((current) => ({
      ...current,
      lastKnownStreamSource,
    }));
  }, [save]);

  return { preferences, setMuted, setVolume, rememberSource };
}
