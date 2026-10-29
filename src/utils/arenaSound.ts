/**
 * Utilitas Suara Bel / Buzzer Pertandingan Lapangan
 * Menggunakan audio resmi /wrong-answer-sound-effect.mp3 dengan fallback Web Audio API sintetis.
 */

export const playAudioFile = (src: string = '/wrong-answer-sound-effect.mp3'): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    try {
      const audio = new Audio(src);
      let isResolved = false;
      const done = () => {
        if (!isResolved) {
          isResolved = true;
          resolve();
        }
      };

      audio.onended = done;
      audio.onerror = () => {
        console.warn(`[arenaSound] Audio file "${src}" gagal dimuat, fallback ke buzzer sintetis`);
        playBuzzerTone(0.75, 0);
        done();
      };

      // Timeout pengaman jika browser menahan event onended
      setTimeout(done, 1400);

      const promise = audio.play();
      if (promise !== undefined) {
        promise.catch((err) => {
          console.warn('[arenaSound] audio.play() diblokir oleh browser atau gagal:', err);
          playBuzzerTone(0.75, 0);
          done();
        });
      }
    } catch {
      playBuzzerTone(0.75, 0);
      resolve();
    }
  });
};

/**
 * 1. Bunyi TEPAT 1 KALI saat timer dimulai (Start / Resume)
 * Memutar /wrong-answer-sound-effect.mp3 sebanyak 1 kali.
 */
export const playTimerStartSound = () => {
  playAudioFile('/wrong-answer-sound-effect.mp3');
};

/**
 * 2. Bunyi TEPAT 2 KALI saat timer pertandingan habis / selesai (00:00)
 * Memutar /wrong-answer-sound-effect.mp3 sebanyak 2 kali berturut-turut dengan jeda singkat.
 */
export const playTimerEndSound = async () => {
  // Bunyi ke-1
  await playAudioFile('/wrong-answer-sound-effect.mp3');
  // Jeda singkat antar bunyi
  await new Promise((resolve) => setTimeout(resolve, 220));
  // Bunyi ke-2
  await playAudioFile('/wrong-answer-sound-effect.mp3');
};

/**
 * Fallback Web Audio API sintetis
 */
export const playBuzzerTone = (durationSeconds = 0.75, delaySeconds = 0) => {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime + delaySeconds;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Harmoni horn stadion futsal: 420Hz + 580Hz + 210Hz sub-bass
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(420, now);
    osc1.frequency.exponentialRampToValueAtTime(360, now + durationSeconds);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(580, now);
    osc2.frequency.exponentialRampToValueAtTime(500, now + durationSeconds);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(210, now);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.45, now + 0.03);
    gainNode.gain.setValueAtTime(0.45, now + durationSeconds * 0.75);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    subOsc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    subOsc.start(now);

    osc1.stop(now + durationSeconds);
    osc2.stop(now + durationSeconds);
    subOsc.stop(now + durationSeconds);
  } catch (error) {
    console.warn('Gagal memutar buzzer sintetis:', error);
  }
};

export const playDoubleAlarmBuzzer = (times = 2) => {
  playTimerEndSound();
};

export const playMatchStartBell = (durationSeconds = 1.3) => {
  playTimerStartSound();
};

export const playSyntheticBuzzer = (durationSeconds = 1.3) => {
  playBuzzerTone(durationSeconds, 0);
};
