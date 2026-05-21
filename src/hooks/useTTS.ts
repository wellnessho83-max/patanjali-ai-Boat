import { useState, useEffect, useCallback } from 'react';

export function useTTS() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const synth = window.speechSynthesis;
    
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      
      // Try to first filter for Google/Microsoft premium Hindi and Google US English
      let filtered = availableVoices.filter(v => {
        const name = (v.name || "").toLowerCase();
        const lang = v.lang || "";
        return (name.includes('google') && lang.startsWith('hi')) || 
               (name.includes('google') && (lang === 'en-US' || lang === 'en_US')) ||
               (name.includes('microsoft') && lang.startsWith('hi')) ||
               (name.includes('microsoft') && (lang === 'en-US' || lang === 'en_US'));
      });

      // Backup: Any Hindi or English voices if no premium ones are found
      if (filtered.length === 0) {
        filtered = availableVoices.filter(v => {
          const lang = v.lang || "";
          return lang.toLowerCase().startsWith('hi') || lang.toLowerCase().startsWith('en');
        });
      }

      // Final fallback: Use all available voices
      if (filtered.length === 0) {
        filtered = availableVoices;
      }

      setVoices(filtered);
      
      // Default to Hindi if available, otherwise first available in filtered list
      const hiIndex = filtered.findIndex(v => (v.lang || "").toLowerCase().startsWith('hi'));
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

  const speak = useCallback((text: string, langPreference?: 'en' | 'hi', onStart?: () => void) => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
    }

    const cleanedText = cleanText(text);
    const utterThis = new SpeechSynthesisUtterance(cleanedText);
    
    // Choose a voice matching the specified language preference first
    let selectedVoice = voices[selectedVoiceIndex];
    if (langPreference) {
      const preferredVoice = voices.find(v => (v.lang || "").toLowerCase().startsWith(langPreference));
      if (preferredVoice) {
        selectedVoice = preferredVoice;
      }
    }

    if (selectedVoice) {
      utterThis.voice = selectedVoice;
      utterThis.lang = selectedVoice.lang;
    } else if (langPreference) {
      utterThis.lang = langPreference === 'hi' ? 'hi-IN' : 'en-US';
    }

    utterThis.onstart = () => {
      setIsSpeaking(true);
      if (onStart) {
        onStart();
      }
    };
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
