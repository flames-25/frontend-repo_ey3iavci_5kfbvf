import React, { useEffect, useRef } from 'react';

export default function AudioController({ src, enabled }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    if (enabled) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [enabled]);

  return <audio ref={audioRef} src={src} preload="none" aria-hidden />;
}
