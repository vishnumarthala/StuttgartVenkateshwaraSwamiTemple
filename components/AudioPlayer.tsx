'use client';

import { useState, useRef, useEffect } from 'react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Check user preference in localStorage
    const preference = localStorage.getItem('audio-preference');

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Attempt auto-play if user hasn't opted out
    if (!prefersReducedMotion && preference !== 'paused') {
      attemptAutoPlay();
    }
  }, []);

  const attemptAutoPlay = async () => {
    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      localStorage.setItem('audio-preference', 'playing');
    } catch (error) {
      // Browser blocked auto-play
      console.log('Auto-play blocked by browser');
      setShowPrompt(true);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      localStorage.setItem('audio-preference', 'paused');
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      localStorage.setItem('audio-preference', 'playing');
      setIsPlaying(true);
      setShowPrompt(false);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/Om Namo Venkatesaya Ringtone.mp3"
        loop
        preload="auto"
      />

      {/* Floating Control Button */}
      <button
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-temple-gold shadow-lg hover:shadow-xl transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-temple-gold focus:ring-offset-2"
        onClick={toggleAudio}
        aria-label={isPlaying ? 'Pause devotional music' : 'Play devotional music'}
      >
        {/* Pulsing waves when playing */}
        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="wave" />
            <div className="wave wave-2" />
            <div className="wave wave-3" />
          </div>
        )}

        {/* Play/Pause Icon */}
        <div className="relative z-10 flex items-center justify-center h-full">
          {isPlaying ? (
            // Pause Icon
            <svg
              className="w-6 h-6 text-temple-dark-gray"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            // Play Icon
            <svg
              className="w-6 h-6 text-temple-dark-gray ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>
      </button>

      {/* Gentle prompt if auto-play blocked */}
      {showPrompt && !isPlaying && (
        <div className="fixed bottom-24 right-6 bg-temple-maroon text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in z-40">
          <p className="text-sm">Click to play devotional music</p>
        </div>
      )}
    </>
  );
}
