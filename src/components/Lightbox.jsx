import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Lightbox({ isOpen, current, onClose, onPrev, onNext }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal
          aria-label="Fullscreen photo viewer"
        >
          <button aria-label="Close" onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60">
            <X />
          </button>

          <div className="relative w-full max-w-6xl mx-auto px-4">
            <img src={current?.src} alt={current?.alt || 'Photo'} className="w-full max-h-[78vh] object-contain rounded-lg" />
            {current?.quote && (
              <div className="mt-4 text-center">
                <p className="text-[#D4AF37] font-serif text-lg">“{current.quote}”</p>
              </div>
            )}
          </div>

          <div className="absolute inset-0 flex items-center justify-between px-2">
            <button aria-label="Previous" onClick={onPrev} className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60">
              <ChevronLeft />
            </button>
            <button aria-label="Next" onClick={onNext} className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60">
              <ChevronRight />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
