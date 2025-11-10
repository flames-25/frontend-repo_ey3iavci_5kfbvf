import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HeroFrame from './components/HeroFrame';
import ThumbnailMasonry from './components/ThumbnailMasonry';
import Lightbox from './components/Lightbox';
import AudioController from './components/AudioController';

const palette = {
  maroon: '#4B0000',
  peacock: '#003B5C',
  gold: '#D4AF37',
  lotus: '#E2A7B4',
  aqua: '#5DA3A5',
};

// Minimal prototype dataset (8 items) for initial review.
// Will be expanded to 30 once assets are provided.
const PROTOTYPE_IMAGES = [
  { id: 'eng1', src: '/assets/eng1.jpg', section: 'Engagement', quote: 'Two souls, one frame.', alt: 'Engagement photo 1' },
  { id: 'eng2', src: '/assets/eng2.jpg', section: 'Engagement', quote: 'A promise softly spoken.', alt: 'Engagement photo 2' },
  { id: 'trad1', src: '/assets/trad1.jpg', section: 'Traditional', quote: 'Rituals woven in gold.', alt: 'Traditional photo 1' },
  { id: 'out1', src: '/assets/out1.jpg', section: 'Outdoor', quote: 'Under the endless sky.', alt: 'Outdoor photo 1' },
  { id: 'can1', src: '/assets/can1.jpg', section: 'Candid', quote: 'Laughter caught in flight.', alt: 'Candid photo 1' },
  { id: 'por1', src: '/assets/por1.jpg', section: 'Portraits', quote: 'Grace in every gaze.', alt: 'Portrait photo 1' },
  { id: 'out2', src: '/assets/out2.jpg', section: 'Outdoor', quote: 'Whispers of the wind.', alt: 'Outdoor photo 2' },
  { id: 'trad2', src: '/assets/trad2.jpg', section: 'Traditional', quote: 'Ancestral echoes.', alt: 'Traditional photo 2' },
];

function splitSections(all) {
  const engagement = all.filter(a => a.section === 'Engagement');
  const others = all.filter(a => a.section !== 'Engagement');
  const groups = {
    Traditional: others.filter(o => o.section === 'Traditional'),
    Outdoor: others.filter(o => o.section === 'Outdoor'),
    Candid: others.filter(o => o.section === 'Candid'),
    Portraits: others.filter(o => o.section === 'Portraits'),
  };
  // When we expand to 30, we will dynamically rebalance; for prototype, keep order.
  return [
    { name: 'Engagement', items: engagement },
    { name: 'Traditional', items: groups.Traditional },
    { name: 'Outdoor', items: groups.Outdoor },
    { name: 'Candid', items: groups.Candid },
    { name: 'Portraits', items: groups.Portraits },
  ];
}

export default function App() {
  const [images] = useState(PROTOTYPE_IMAGES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const timerRef = useRef(null);

  const heroQueue = useMemo(() => {
    const engagement = images.filter(i => i.section === 'Engagement');
    const rest = images.filter(i => i.section !== 'Engagement');
    return [...engagement, ...rest];
  }, [images]);

  const current = heroQueue[currentIndex % heroQueue.length];

  const next = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % heroQueue.length);
  }, [heroQueue.length]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + heroQueue.length) % heroQueue.length);
  }, [heroQueue.length]);

  const onUserInteracted = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % heroQueue.length);
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, heroQueue.length]);

  const sections = useMemo(() => splitSections(images), [images]);

  const handleSelect = (item) => {
    const index = heroQueue.findIndex(i => i.id === item.id);
    if (index !== -1) setCurrentIndex(index);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0b0b14] via-[#091520] to-[#071018] text-white">
      <header className="w-full text-center py-10">
        <h1 className="text-3xl md:text-5xl font-serif tracking-wide">
          <span className="text-[#E2A7B4]">Nikhilsingh</span> & <span className="text-[#5DA3A5]">Sailee</span>
        </h1>
        <p className="mt-2 text-sm md:text-base text-white/70">Engagement & Pre-wedding Album</p>
      </header>

      <HeroFrame
        current={current}
        quote={current?.quote}
        isPlaying={isPlaying}
        onPrev={prev}
        onNext={next}
        onTogglePlay={() => setIsPlaying(p => !p)}
        onOpenLightbox={() => setLightboxOpen(true)}
        onUserInteracted={onUserInteracted}
        audioEnabled={audioEnabled}
        onToggleAudio={() => setAudioEnabled(a => !a)}
      />

      <section className="py-10">
        <ThumbnailMasonry sections={sections} onSelect={(item) => { onUserInteracted(); handleSelect(item); }} />
      </section>

      <Lightbox
        isOpen={lightboxOpen}
        current={current}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => { onUserInteracted(); prev(); }}
        onNext={() => { onUserInteracted(); next(); }}
      />

      <AudioController src="/assets/bg-loop.mp3" enabled={audioEnabled} />

      <footer className="py-8 text-center text-white/60 text-xs">
        Crafted with elegance — royal water-lotus-peacock aesthetic.
      </footer>
    </div>
  );
}
