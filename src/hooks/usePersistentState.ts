import { useState, useEffect } from 'react';

/**
 * usePersistentState
 * Hook React yang menyimpan dan memulihkan state dari localStorage secara otomatis.
 * Mencegah data kembali ke nilai awal (reset) saat halaman di-reload oleh pengguna.
 */
export function usePersistentState<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Ambil data yang tersimpan di localStorage setelah mount di client (SSR-safe)
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
    } finally {
      setIsHydrated(true);
    }
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
        }
      } catch (err) {
        console.warn(`[usePersistentState] Gagal menyimpan data "${key}":`, err);
      }

      return nextState;
    });
  };

  return [state, setPersistentState];
}

