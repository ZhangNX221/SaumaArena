/**
 * Utilitas Suara Bel / Buzzer Pertandingan Lapangan
 * Memutar file audio resmi /wrong-answer-sound-effect.mp3 dengan fallback Web Audio API sintetis.
 */
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
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(420, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(360, ctx.currentTime + durationSeconds);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(580, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + durationSeconds);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(210, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.4, ctx.currentTime + durationSeconds * 0.7);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    subOsc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
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
