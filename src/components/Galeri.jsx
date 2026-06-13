import { useState, useEffect, useCallback } from 'react';

export default function Galeri({ setCurrentPage }) {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    fetch('https://api.desadumbayabulan.my.id/api/v1/gallery')
      .then((res) => {
        if (!res.ok) throw new Error('Gagal mengambil data galeri');
        return res.json();
      })
      .then((data) => {
        setGalleries(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filter galleries based on search query
  const filteredGalleries = galleries.filter((img) =>
    (img.alt || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigate images in lightbox
  const handlePrev = useCallback(() => {
    if (activeImageIndex === null || filteredGalleries.length === 0) return;
    setIsZoomed(false);
    setActiveImageIndex((prev) => (prev === 0 ? filteredGalleries.length - 1 : prev - 1));
  }, [activeImageIndex, filteredGalleries.length]);

  const handleNext = useCallback(() => {
    if (activeImageIndex === null || filteredGalleries.length === 0) return;
    setIsZoomed(false);
    setActiveImageIndex((prev) => (prev === filteredGalleries.length - 1 ? 0 : prev + 1));
  }, [activeImageIndex, filteredGalleries.length]);

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

  return (
    <div className="min-h-screen bg-surface py-12 px-4 md:px-10 max-w-[1280px] mx-auto animate-fade-in space-y-12">
      
      {/* Breadcrumb and Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30 pb-6">
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <button 
            onClick={() => setCurrentPage('home')}
            className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1 font-medium"
          >
            <span className="material-symbols-outlined text-lg">home</span> Beranda
          </button>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="font-semibold text-primary">Galeri</span>
        </div>
        
        <button
          onClick={() => setCurrentPage('home')}
          className="inline-flex items-center gap-2 px-4 py-2 border border-outline/30 rounded-xl text-sm font-semibold hover:bg-surface-container transition-all cursor-pointer shadow-sm w-fit"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Kembali ke Beranda
        </button>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden bg-primary text-on-primary rounded-3xl p-8 md:p-12 shadow-xl border border-primary-container">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute -left-10 -top-10 w-64 h-64 bg-primary-fixed/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="px-3 py-1 bg-white/10 text-primary-fixed text-xs font-bold tracking-widest uppercase rounded-full border border-white/10">
            Koleksi Visual
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Galeri Desa Dumbaya Bulan
          </h1>
          <p className="text-on-primary/80 text-sm md:text-base leading-relaxed">
            Menampilkan dokumentasi pembangunan, kegiatan kemasyarakatan, keindahan alam, serta potensi unggulan di wilayah Desa Dumbaya Bulan.
          </p>
        </div>
      </div>

      {/* Toolbar: Search and Statistics */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20 shadow-sm">
        <div className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">photo_library</span>
          Menampilkan <span className="text-primary font-bold">{filteredGalleries.length}</span> dari <span className="font-bold">{galleries.length}</span> foto
        </div>
        
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Cari foto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface rounded-xl border border-outline/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-primary text-on-surface-variant transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, idx) => (
            <div 
              key={idx} 
              className="aspect-square rounded-2xl bg-surface-container-high animate-pulse border border-outline-variant/10"
            ></div>
          ))}
        </div>
      ) : filteredGalleries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-surface-container-lowest rounded-3xl border border-dashed border-outline/30">
          <span className="material-symbols-outlined text-6xl text-outline/50 animate-bounce">
            image_not_supported
          </span>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-on-surface">Foto Tidak Ditemukan</h3>
            <p className="text-sm text-on-surface-variant max-w-sm">
              {searchQuery ? `Tidak ada dokumentasi yang cocok dengan kata kunci "${searchQuery}".` : 'Belum ada dokumentasi galeri yang diunggah.'}
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-all cursor-pointer shadow"
            >
              Bersihkan Pencarian
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filteredGalleries.map((img, idx) => (
            <div
              key={img.id || idx}
              onClick={() => setActiveImageIndex(idx)}
              className="group flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-outline-variant/20 bg-surface-container-lowest cursor-pointer"
            >
              {/* Image Container with zoom aspect */}
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-high">
                <img
                  src={img.src}
                  alt={img.alt || 'Galeri Foto Desa'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
      )}

      {/* Lightbox Modal */}
      {activeImageIndex !== null && filteredGalleries[activeImageIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8 animate-fade-in">
          
          {/* Top Bar inside Lightbox */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-between px-6 z-10">
            <span className="text-white/80 text-sm font-semibold">
              {activeImageIndex + 1} / {filteredGalleries.length} - {filteredGalleries[activeImageIndex].alt || 'Dokumentasi Desa'}
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
              src={filteredGalleries[activeImageIndex].src}
              alt={filteredGalleries[activeImageIndex].alt || 'Galeri Foto Desa'}
              className={`max-w-full max-h-[80vh] object-contain rounded-lg transition-transform duration-300 shadow-2xl ${
                isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            />
          </div>

          {/* Image Caption Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end items-center pb-6 text-center px-4">
            <p className="text-white text-base font-semibold max-w-2xl drop-shadow">
              {filteredGalleries[activeImageIndex].alt || 'Galeri Foto Desa Dumbaya Bulan'}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
