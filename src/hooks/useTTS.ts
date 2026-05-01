import { useState, useEffect, useCallback } from 'react';

export function useTTS() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const synth = window.speechSynthesis;
    
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      
      // Filter for only Google Hindi and Google US English
      const filtered = availableVoices.filter(v => {
        const name = (v.name || "").toLowerCase();
        const lang = v.lang || "";
        return (name.includes('google') && lang.startsWith('hi')) || 
               (name.includes('google') && (lang === 'en-US' || lang === 'en_US'));
      });

      setVoices(filtered);
      
      // Default to Google Hindi if available, otherwise first available in filtered list
      const hiIndex = filtered.findIndex(v => (v.lang || "").startsWith('hi'));
      if (hiIndex !== -1) {
        setSelectedVoiceIndex(hiIndex);
      } else if (filtered.length > 0) {
        setSelectedVoiceIndex(0);
      }
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    return () => {
      synth.cancel();
    };
  }, []);

  const cleanText = (rawText: string) => {
    return rawText
      .replace(/\[YOGA:[a-z-]+\]/g, '') // Remove Yoga tags
      .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold
      .replace(/(\*|_)(.*?)\1/g, '$2') // Remove italics
      .replace(/#+\s+(.*?)(\n|$)/g, '$1 ') // Remove headers
      .replace(/`{1,3}.*?`{1,3}/gs, '') // Remove inline code and code blocks
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links but keep text
      // Remove symbols like emojis, math symbols, and special markdown characters
      .replace(/[\\#*`_~|{}[\]<>^+=]/g, ' ') 
      // Replace specific symbols with spaces or nothing to avoid mispronunciation
      .replace(/[^\w\s\u0900-\u097F.,?!:;]/g, ' ') // Keep alphanumeric, spaces, Hindi characters, and basic punctuation
      .replace(/\s+/g, ' ') // Collapse multiple spaces
      .trim();
  };

  const speak = useCallback((text: string) => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
    }

    const cleanedText = cleanText(text);
    const utterThis = new SpeechSynthesisUtterance(cleanedText);
    if (voices[selectedVoiceIndex]) {
      utterThis.voice = voices[selectedVoiceIndex];
    }

    utterThis.onstart = () => setIsSpeaking(true);
    utterThis.onend = () => setIsSpeaking(false);
    utterThis.onerror = () => setIsSpeaking(false);

    synth.speak(utterThis);
  }, [voices, selectedVoiceIndex]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    voices,
    selectedVoiceIndex,
    setSelectedVoiceIndex,
    speak,
    stop,
    isSpeaking
  };
}
