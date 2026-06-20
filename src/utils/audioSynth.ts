/**
 * Programmatic Web Audio Synthesizer & Speech Pronunciation Engine
 * for Aramaic Syriac characters.
 */

// Play a resonant medieval tone representing the ancient letter
export function playAncientTone(charValue: number) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    
    // Scale frequency based on the numerical abjad value of the letter
    // Map numerical values (1-400) to distinct harmonic pitches between 180Hz and 540Hz
    const baseFreq = 180 + (charValue % 22) * 15;
    
    // Create multiple oscillators for a richer, more warm cathedral-like sound
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'triangle'; // Warm organic bass
    osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    
    osc2.type = 'sine'; // Pure harmonic overlay
    osc2.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.Q.setValueAtTime(3, ctx.currentTime);

    // Fade out smoothly to sound like a struck stone or ancient bell
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();

    osc1.stop(ctx.currentTime + 1.2);
    osc2.stop(ctx.currentTime + 1.2);
  } catch (error) {
    console.warn('AudioContext not supported or blocked by user interaction', error);
  }
}

// Speak the Indonesian explanation and phonetic name
export function speakLetterName(letterName: string, phoneme: string) {
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    return;
  }

  // Cancel any ongoing speeches
  window.speechSynthesis.cancel();

  const textToSpeak = `Huruf ${letterName}. Dilafalkan ${phoneme.split('(')[0].trim()}`;
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  
  // Try to find an Indonesian voice if available
  const voices = window.speechSynthesis.getVoices();
  const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
  if (idVoice) {
    utterance.voice = idVoice;
  }
  
  utterance.pitch = 1.05; // slightly historic/gentle pitch
  utterance.rate = 0.95; // realistic learning speed
  
  window.speechSynthesis.speak(utterance);
}
