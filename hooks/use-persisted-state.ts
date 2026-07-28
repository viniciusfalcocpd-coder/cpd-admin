"use client";

import { useEffect, useState } from "react";

export function usePersistedState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(key);

    if (raw !== null) {
      try {
        setValue(JSON.parse(raw) as T);
      } catch {
        setValue(initialValue);
      }
    }

    setReady(true);
  }, [initialValue, key]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, ready, value]);

  return [value, setValue] as const;
}
