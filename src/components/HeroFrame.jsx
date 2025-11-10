import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import { motion, AnimatePresence } from 'framer-motion';

function useDominantColor(src) {
  const [color, setColor] = useState('#0b0b14');
  useEffect(() => {
    if (!src) return;
    let active = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const w = 40;
        const h = Math.max(1, Math.round((img.height / img.width) * w));
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha < 150) continue;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        if (count === 0) return;
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        const tint = `rgb(${r}, ${g}, ${b})`;
        if (active) setColor(tint);
      } catch (e) {
        // ignore sampling errors
      }
    };
    return () => { active = false; };
  }, [src]);
  return color;
}

export default function HeroFrame({
  current,
  quote,
  isPlaying,
  onPrev,
  onNext,
  onTogglePlay,
  onOpenLightbox,
  onUserInteracted,
  audioEnabled,
  onToggleAudio,
}) {
  const containerRef = useRef(null);
  const [ripple, setRipple] = useState(null);
  const dominant = useDominantColor(current?.src);

  useEffect(() => {
    if (!current?.src) return;
    const img = new Image();
    img.src = current.src;
  }, [current]);

  const handleNavigate = (dir, e) => {
    onUserInteracted?.();
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect && e) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setRipple({ id: Date.now(), x, y });
      setTimeout(() => setRipple(null), 600);
    }
    if (dir === 'prev') onPrev(); else onNext();
  };

  const gradient = useMemo(() => {
    return `linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35)), radial-gradient(1200px 600px at 50% 30%, ${dominant}22, transparent 70%)`;
  }, [dominant]);

  return (
    <section className="relative w-full min-h-[60vh] md:h-[70vh] lg:h-[78vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <Spline scene="https://prod.spline.design/xzUirwcZB9SOxUWt/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#4B0000]/60 via-[#003B5C]/40 to-[#0b0b14]/75" />
      </div>

      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-[1100px] mx-auto px-4"
      >
        <div
          className="relative rounded-2xl p-[10px] md:p-4"
          style={{
            background: gradient,
            boxShadow: '0 20px 60px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(212,175,55,0.25)'
          }}
        >
          <div className="pointer-events-none absolute -inset-[2px] rounded-2xl" style={{ boxShadow: '0 0 0 2px rgba(212,175,55,0.5), inset 0 0 40px rgba(212,175,55,0.08)' }} />

          <div className="absolute top-3 right-3 flex gap-2 z-20">
            <button aria-label={isPlaying ? 'Pause autoplay' : 'Play slideshow'} onClick={() => { onUserInteracted?.(); onTogglePlay(); }} className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/40 text-[#D4AF37] hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60">
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              <span className="hidden sm:block text-sm">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'} onClick={() => { onUserInteracted?.(); onToggleAudio(); }} className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/40 text-[#D4AF37] hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60">
              {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span className="hidden sm:block text-sm">Audio</span>
            </button>
          </div>

          <div className="relative aspect-[16/10] md:aspect-[16/9] overflow-hidden rounded-xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={current?.id}
                src={current?.src}
                alt={current?.alt || 'Album photo'}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.02, filter: 'brightness(0.95) blur(2px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'brightness(1) blur(0px)' }}
                exit={{ opacity: 0, scale: 0.98, filter: 'brightness(0.9) blur(2px)' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                sizes="(max-width: 768px) 100vw, 1100px"
                loading="eager"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1496865534669-25ec2a3a3dc0?q=80&w=1600&auto=format&fit=crop'; }}
              />
            </AnimatePresence>

            {ripple && (
              <span
                key={ripple.id}
                className="pointer-events-none absolute rounded-full bg-white/20"
                style={{
                  left: `${ripple.x}%`,
                  top: `${ripple.y}%`,
                  width: 20,
                  height: 20,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 0 0 rgba(255,255,255,0.4)',
                  animation: 'ripple 0.6s ease-out',
                }}
              />
            )}

            {quote && (
              <div className="absolute left-3 bottom-3 md:left-6 md:bottom-6 max-w-[80%]">
                <div className="bg-black/45 backdrop-blur-sm text-[#D4AF37] rounded-lg px-3 py-2 md:px-4 md:py-3 shadow-lg">
                  <p className="font-serif text-sm md:text-lg leading-snug">“{quote}”</p>
                </div>
              </div>
            )}

            <div className="absolute inset-0 flex items-center justify-between">
              <button aria-label="Previous photo" onClick={(e) => handleNavigate('prev', e)} className="m-2 md:m-4 p-2 md:p-3 rounded-full bg-black/35 text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60">
                <ChevronLeft />
              </button>
              <button aria-label="Open fullscreen" onClick={() => { onUserInteracted?.(); onOpenLightbox(); }} className="absolute top-3 left-3 md:top-3 md:left-3 p-2 rounded-full bg-black/35 text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60">
                <Maximize size={18} />
              </button>
              <button aria-label="Next photo" onClick={(e) => handleNavigate('next', e)} className="m-2 md:m-4 p-2 md:p-3 rounded-full bg-black/35 text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60">
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ripple {
          to { box-shadow: 0 0 0 40px rgba(255,255,255,0); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
