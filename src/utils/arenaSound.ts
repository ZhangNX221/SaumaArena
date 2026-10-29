/**
 * Utilitas Suara Bel / Buzzer Pertandingan Lapangan
 * Menggunakan Web Audio API sintetis & audio resmi.
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
    console.warn('Gagal memutar buzzer stadion:', error);
  }
};

/**
 * Memainkan suara alarm stadion tepat 2 KALI berturut-turut saat waktu habis
 */
export const playDoubleAlarmBuzzer = (times = 2) => {
  const duration = 0.75; // Durasi bunyi (0.75 detik)
  const gap = 0.28; // Jeda antar bunyi (0.28 detik)

  for (let i = 0; i < times; i++) {
    playBuzzerTone(duration, i * (duration + gap));
  }
};

export const playMatchStartBell = (durationSeconds = 1.3) => {
  try {
    const audio = new Audio('/wrong-answer-sound-effect.mp3');
    audio.play().catch((err) => {
      console.warn('Audio play failed, falling back to Web Audio oscillator:', err);
      playSyntheticBuzzer(durationSeconds);
    });
  } catch (error) {
    console.warn('Gagal memutar audio file:', error);
    playSyntheticBuzzer(durationSeconds);
  }
};

export const playSyntheticBuzzer = (durationSeconds = 1.3) => {
  playBuzzerTone(durationSeconds, 0);
};
