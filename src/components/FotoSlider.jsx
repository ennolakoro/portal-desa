import { useState, useEffect, useRef, useCallback } from 'react';

const API = 'https://api.desadumbayabulan.my.id/api/v1/foto-slider';
const PER_PAGE = 4; // Tampilkan 4 foto sekaligus

export default function FotoSlider() {
  const [slides, setSlides] = useState([]);
  const [page, setPage] = useState(0); // indeks grup (0, 1, 2, ...)
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length) setSlides(data); })
      .catch(() => { });
  }, []);

  const totalPages = Math.ceil(slides.length / PER_PAGE);

  const next = useCallback(() => setPage(p => (p + 1) % totalPages), [totalPages]);
  const prev = useCallback(() => setPage(p => (p - 1 + totalPages) % totalPages), [totalPages]);

  // Auto-slide setiap 5 detik
  useEffect(() => {
    if (totalPages <= 1 || isPaused) return;
    timerRef.current = setTimeout(next, 5000);
    return () => clearTimeout(timerRef.current);
  }, [page, totalPages, isPaused, next]);

  if (!slides.length) return null;

  // Ambil 4 foto untuk halaman saat ini
  const start = page * PER_PAGE;
  const currentSlide = slides.slice(start, start + PER_PAGE);

  // Split caption → baris pertama tebal (nama), baris kedua kecil (jabatan/keterangan)
  const parseCaption = (caption) => {
    if (!caption) return { title: '', sub: '' };
    const lines = caption.split('\n');
    return { title: lines[0] || '', sub: lines[1] || '' };
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <span className="text-primary font-bold text-xs tracking-widest uppercase mb-2 block">
            SOTK
          </span>
          <h2 className="text-primary font-semibold text-4xl tracking-tight">
            Struktur Organisasi dan Tata Kerja Desa Data
          </h2>
        </div>

        {/* Navigasi Panah & Dots */}
        <div className="flex items-center gap-3">
          {/* Dots */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`rounded-full transition-all duration-300 cursor-pointer border-none focus:outline-none ${i === page ? 'w-6 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-outline-variant hover:bg-primary/50'
                    }`}
                  aria-label={`Grup ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Panah */}
          {totalPages > 1 && (
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border-2 border-outline-variant/50 hover:border-primary hover:bg-primary hover:text-on-primary text-primary flex items-center justify-center transition-all duration-200 cursor-pointer"
                aria-label="Sebelumnya"
              >
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full border-2 border-outline-variant/50 hover:border-primary hover:bg-primary hover:text-on-primary text-primary flex items-center justify-center transition-all duration-200 cursor-pointer"
                aria-label="Selanjutnya"
              >
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid 4 Foto */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {currentSlide.map((slide, i) => {
          const { title, sub } = parseCaption(slide.caption);
          const isFirst = (start === 0 && i === 0); // Foto pertama sedikit lebih besar
          return (
            <div
              key={slide.id}
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-md border border-outline-variant/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-400 ${isFirst ? 'md:row-span-1' : ''}`}
            >
              {/* Foto */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
                <img
                  src={slide.image_url}
                  alt={title || `Foto ${start + i + 1}`}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Bar Keterangan — seperti di referensi (teal bar bawah) */}
              {(title || sub) && (
                <div className="bg-primary px-4 py-3 text-on-primary text-center">
                  {title && (
                    <p className="font-extrabold text-sm md:text-base leading-tight tracking-wide uppercase">
                      {title}
                    </p>
                  )}
                  {sub && (
                    <p className="text-on-primary/80 text-xs mt-0.5 font-medium">
                      {sub}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
