import { useState, useEffect, useCallback } from 'react';

export default function Gallery({ setCurrentPage }) {
  const [galleries, setGalleries] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/gallery')
      .then(res => res.json())
      .then(data => setGalleries(data))
      .catch(err => console.error(err));
  }, []);

  // Show exactly 4 images on the homepage preview
  const previewGalleries = galleries.slice(0, 4);

  // Navigate images in lightbox
  const handlePrev = useCallback(() => {
    if (activeImageIndex === null || previewGalleries.length === 0) return;
    setIsZoomed(false);
    setActiveImageIndex((prev) => (prev === 0 ? previewGalleries.length - 1 : prev - 1));
  }, [activeImageIndex, previewGalleries.length]);

  const handleNext = useCallback(() => {
    if (activeImageIndex === null || previewGalleries.length === 0) return;
    setIsZoomed(false);
    setActiveImageIndex((prev) => (prev === previewGalleries.length - 1 ? 0 : prev + 1));
  }, [activeImageIndex, previewGalleries.length]);

  const handleClose = useCallback(() => {
    setActiveImageIndex(null);
    setIsZoomed(false);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeImageIndex === null) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, handlePrev, handleNext, handleClose]);

  if (galleries.length === 0) return null;

  return (
    <section className="space-y-16 animate-fade-in">
      <div>
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <span className="text-primary font-bold text-xs tracking-widest uppercase mb-2 block">
              Lensa Visual
            </span>
            <h2 className="text-primary font-semibold text-4xl tracking-tight">
              Galeri Desa Dumbaya Bulan
            </h2>
          </div>
          <button 
            onClick={() => setCurrentPage('galeri')}
            className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-3 hover:bg-primary-container hover:shadow-xl transition-all duration-300 shadow-md cursor-pointer text-sm"
          >
            Lihat Koleksi Lengkap{' '}
            <span className="material-symbols-outlined text-lg">grid_view</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {previewGalleries.map((img, idx) => (
            <div
              key={img.id || idx}
              onClick={() => setActiveImageIndex(idx)}
              className="group flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-outline-variant/20 bg-surface-container-lowest cursor-pointer"
            >
              {/* Image Container with zoom aspect */}
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-high">
                <img
                  alt={img.alt || 'Galeri Foto Desa'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={img.src}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-3xl bg-primary/60 p-3 rounded-full backdrop-blur-sm">
                    zoom_in
                  </span>
                </div>
              </div>

              {/* Text Description Box */}
              <div className="p-4">
                <p className="text-on-surface font-semibold text-sm line-clamp-2 leading-relaxed">
                  {img.keterangan || img.alt || 'Dokumentasi Kegiatan Desa Dumbaya Bulan'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImageIndex !== null && previewGalleries[activeImageIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8 animate-fade-in">
          
          {/* Top Bar inside Lightbox */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-between px-6 z-10">
            <span className="text-white/80 text-sm font-semibold">
              {activeImageIndex + 1} / {previewGalleries.length} - {previewGalleries[activeImageIndex].alt || 'Dokumentasi Desa'}
            </span>
            <div className="flex items-center gap-4">
              {/* Zoom Button */}
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 cursor-pointer"
                title={isZoomed ? 'Perkecil' : 'Perbesar'}
              >
                <span className="material-symbols-outlined text-2xl">
                  {isZoomed ? 'zoom_out' : 'zoom_in'}
                </span>
              </button>
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 cursor-pointer"
                title="Tutup"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
          </div>

          {/* Navigation Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-all z-20 cursor-pointer select-none"
            aria-label="Sebelumnya"
          >
            <span className="material-symbols-outlined text-2xl md:text-3xl">chevron_left</span>
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-all z-20 cursor-pointer select-none"
            aria-label="Berikutnya"
          >
            <span className="material-symbols-outlined text-2xl md:text-3xl">chevron_right</span>
          </button>

          {/* Image Container */}
          <div 
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClose();
            }}
            className="w-full h-full flex items-center justify-center overflow-auto max-w-5xl select-none"
          >
            <img
              src={previewGalleries[activeImageIndex].src}
              alt={previewGalleries[activeImageIndex].alt || 'Galeri Foto Desa'}
              className={`max-w-full max-h-[80vh] object-contain rounded-lg transition-transform duration-300 shadow-2xl ${
                isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            />
          </div>

          {/* Image Caption Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end items-center pb-6 text-center px-4">
            <p className="text-white text-base font-semibold max-w-2xl drop-shadow">
              {previewGalleries[activeImageIndex].alt || 'Galeri Foto Desa Dumbaya Bulan'}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
