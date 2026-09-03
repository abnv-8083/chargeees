'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { GalleryItemData } from '@/lib/types';
import { X, Play, ZoomIn } from 'lucide-react';

const FALLBACK: GalleryItemData[] = Array.from({ length: 12 }, (_, i) => ({
  _id: String(i + 1),
  title: `Gallery Item ${i + 1}`,
  url: '',
  type: 'image' as const,
  folder: ['Architecture', 'Events', 'Team', 'Projects'][i % 4],
  caption: `Caption for item ${i + 1}`,
  tags: [],
}));

function GalleryPlaceholder({ index }: { index: number }) {
  const heights = [200, 280, 180, 240, 320, 200, 260, 180, 300, 220, 280, 200];
  const h = heights[index % heights.length];
  return (
    <div style={{ width: '100%', height: h, background: `hsl(0, 0%, ${8 + (index % 5) * 2}%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'rgba(255,255,255,0.05)' }}>
        {String.fromCharCode(65 + (index % 26))}
      </span>
    </div>
  );
}

export default function GallerySection({ data }: { data?: GalleryItemData[] }) {
  const items = data && data.length > 0 ? data : FALLBACK;
  const [activeFolder, setActiveFolder] = useState('All');
  const [lightbox, setLightbox] = useState<GalleryItemData | null>(null);
  const [visible, setVisible] = useState(12);
  const folders = ['All', ...Array.from(new Set(items.map(i => i.folder)))];
  const filtered = activeFolder === 'All' ? items : items.filter(i => i.folder === activeFolder);
  const shown = filtered.slice(0, visible);

  // Close lightbox on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <section id="gallery" className="section-py" style={{ background: 'var(--gray-900)', position: 'relative' }} data-cursor-color="#a78bfa">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '3rem' }}
        >
          <p className="label-sm" style={{ marginBottom: '1rem' }}>Visual Showcase</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <h2 className="heading-xl">Gallery</h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {folders.map(f => (
                <button
                  key={f}
                  className={`filter-btn ${activeFolder === f ? 'active' : ''}`}
                  onClick={() => { setActiveFolder(f); setVisible(12); }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Masonry Gallery */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFolder}
            className="gallery-masonry"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {shown.map((item, i) => (
              <motion.div
                key={item._id}
                className="gallery-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.6 }}
                onClick={() => setLightbox(item)}
                role="button"
                aria-label={`View ${item.title}`}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setLightbox(item)}
                data-cursor-hover
              >
                {item.url ? (
                  item.type === 'video' ? (
                    <video src={item.url} muted playsInline style={{ width: '100%', height: 'auto' }} />
                  ) : (
                    <Image src={item.url} alt={item.title || `Gallery ${i + 1}`} width={600} height={400} style={{ width: '100%', height: 'auto' }} loading="lazy" />
                  )
                ) : (
                  <GalleryPlaceholder index={i} />
                )}
                <div className="gallery-item-overlay">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    {item.type === 'video' ? <Play size={28} color="white" /> : <ZoomIn size={28} color="white" />}
                    {item.caption && <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textAlign: 'center', maxWidth: 160 }}>{item.caption}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Load More */}
        {visible < filtered.length && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button className="btn-outline" onClick={() => setVisible(v => v + 12)}>Load More</button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
              aria-label="Close lightbox"
            >
              <X size={20} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              {lightbox.url ? (
                lightbox.type === 'video' ? (
                  <video src={lightbox.url} controls autoPlay style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 8 }} />
                ) : (
                  <Image src={lightbox.url} alt={lightbox.title} width={1200} height={800} style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 8 }} />
                )
              ) : (
                <div style={{ width: 600, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-800)', borderRadius: 8 }}>
                  <span style={{ color: 'var(--gray-500)' }}>No preview available</span>
                </div>
              )}
              {lightbox.caption && (
                <p style={{ textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.875rem', marginTop: '1rem' }}>{lightbox.caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
