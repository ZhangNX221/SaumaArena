'use client';

import { useState, useEffect } from 'react';

/**
 * Hook untuk menyimpan dan menyinkronkan state ke localStorage secara otomatis
 * Mendukung sinkronisasi real-time antar-tab (StorageEvent) dan antar-komponen dalam 1 tab (CustomEvent).
 */
export function usePersistentState<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(key);
        if (saved !== null) {
          setState(JSON.parse(saved));
        }
      }
    } catch (err) {
      console.warn(`[usePersistentState] Gagal memuat data "${key}":`, err);
    }

    // 1. Dengarkan perubahan dari tab/window browser lain (Native StorageEvent)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setState(JSON.parse(e.newValue));
        } catch {
          // Abaikan parsing error jika nilai baru korup
        }
      }
    };

    // 2. Dengarkan perubahan dari komponen lain dalam jendela/tab yang sama (Custom Event)
    const handleLocalSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; value: T }>;
      if (customEvent.detail && customEvent.detail.key === key) {
        setState(customEvent.detail.value);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sauma_state_sync', handleLocalSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sauma_state_sync', handleLocalSync);
    };
  }, [key]);

  const setPersistentState: React.Dispatch<React.SetStateAction<T>> = (valueAction) => {
    setState((prevState) => {
      const nextState =
        typeof valueAction === 'function'
          ? (valueAction as (prev: T) => T)(prevState)
          : valueAction;

      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, JSON.stringify(nextState));
          // Pancarkan event sinkronisasi setelah siklus render React selesai
          queueMicrotask(() => {
            window.dispatchEvent(
              new CustomEvent('sauma_state_sync', {
                detail: { key, value: nextState },
              })
            );
          });
        }
      } catch (err) {
        console.warn(`[usePersistentState] Gagal menyimpan data "${key}":`, err);
      }

      return nextState;
    });
  };

  return [state, setPersistentState];
}
