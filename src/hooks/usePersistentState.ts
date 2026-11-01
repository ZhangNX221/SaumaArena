'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Hook untuk menyimpan dan menyinkronkan state ke localStorage secara otomatis
 * Mendukung sinkronisasi real-time antar-tab (StorageEvent) dan antar-komponen dalam 1 tab (CustomEvent).
 * Dioptimalkan dengan memoized instance tracking untuk mencegah render cascading redundant.
 */
export function usePersistentState<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(defaultValue);
  const hookInstanceId = useRef<string>(Math.random().toString(36).substring(2, 9));

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
          const parsed = JSON.parse(e.newValue);
          setState(parsed);
        } catch {
          // Abaikan parsing error jika nilai baru korup
        }
      }
    };

    // 2. Dengarkan perubahan dari komponen lain dalam jendela/tab yang sama (Custom Event)
    const handleLocalSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; value: T; sourceId?: string }>;
      if (
        customEvent.detail &&
        customEvent.detail.key === key &&
        customEvent.detail.sourceId !== hookInstanceId.current
      ) {
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

      // Optimisasi Kinerja: Jika referensi identik, batalkan penulisan storage dan event dispatch
      if (prevState === nextState) {
        return prevState;
      }

      try {
        if (typeof window !== 'undefined') {
          const nextJson = JSON.stringify(nextState);
          const prevJson = localStorage.getItem(key);

          // Hindari I/O disk jika data JSON identik
          if (prevJson !== nextJson) {
            localStorage.setItem(key, nextJson);
            queueMicrotask(() => {
              window.dispatchEvent(
                new CustomEvent('sauma_state_sync', {
                  detail: { key, value: nextState, sourceId: hookInstanceId.current },
                })
              );
            });
          }
        }
      } catch (err) {
        console.warn(`[usePersistentState] Gagal menyimpan data "${key}":`, err);
      }

      return nextState;
    });
  };

  return [state, setPersistentState];
}
