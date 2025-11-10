import React from 'react';

function SectionLabel({ name }) {
  return (
    <span className="absolute top-2 left-2 z-10 rounded-full bg-[#D4AF37]/90 text-[#1a1212] text-[10px] md:text-xs font-semibold px-2 py-1 shadow">
      {name}
    </span>
  );
}

export default function ThumbnailMasonry({ sections, onSelect }) {
  return (
    <div className="w-full px-4 max-w-[1200px] mx-auto">
      {sections.map((section) => (
        <div key={section.name} className="mb-8">
          <h3 className="text-[#D4AF37] font-serif text-xl md:text-2xl mb-4">{section.name}</h3>
          <div className="grid gap-3 md:gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
            {section.items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className={`relative group overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60 ${idx % 7 === 0 ? 'row-span-2' : ''}`}
                style={{ aspectRatio: idx % 5 === 0 ? '3/4' : idx % 3 === 0 ? '4/3' : '1/1' }}
                aria-label={`Open ${section.name} photo`}
              >
                <SectionLabel name={section.name} />
                <img
                  src={item.src}
                  alt={item.alt || `${section.name} thumbnail`}
                  loading="lazy"
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop'; }}
                />
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_50%_120%,rgba(212,175,55,0.25),transparent_40%)]" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
