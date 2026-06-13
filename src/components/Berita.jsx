import { useState, useEffect } from 'react';

const categories = ['Semua', 'Pemerintahan', 'Wisata', 'Ekonomi', 'Pengumuman', 'Pembangunan'];

export default function Berita({ setCurrentPage, setSelectedNewsId }) {
  const [newsData, setNewsData] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePaginationPage, setActivePaginationPage] = useState(1);

  useEffect(() => {
    fetch('https://api.desadumbayabulan.my.id/api/v1/berita')
      .then(res => res.json())
      .then(data => setNewsData(data))
      .catch(err => console.error(err));
  }, []);

  const filteredNews = newsData.filter((item) => {
    const matchesCategory = activeCategory === 'Semua' || item.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="animate-fade-in max-w-[1280px] mx-auto px-4 md:px-10 py-10 md:py-16">
      {/* Page Header */}
      <div className="mb-12 md:mb-16">
        <h1 className="text-3xl md:text-[48px] md:leading-[56px] font-bold text-primary mb-4 tracking-tight">
          Semua Berita Desa Dumbaya Bulan
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant max-w-3xl leading-relaxed">
          Dapatkan informasi terbaru mengenai kegiatan, pengumuman resmi, dan perkembangan
          pembangunan di lingkungan Desa Dumbaya Bulan secara transparan dan akuntabel.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setActivePaginationPage(1); }}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-surface-container hover:bg-primary-fixed-dim text-on-surface-variant'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-96">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setActivePaginationPage(1); }}
            className="w-full pl-12 pr-4 py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm"
            placeholder="Cari berita..."
          />
        </div>
      </div>

      {/* News Grid */}
      {filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              onClick={() => {
                setSelectedNewsId(item.id);
                setCurrentPage('detail-berita');
              }}
              className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-3">
                {/* Category & Date */}
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[11px] font-semibold uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-outline text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-primary leading-tight line-clamp-2 group-hover:text-secondary transition-colors">
                  {item.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-on-surface-variant line-clamp-3 leading-relaxed">
                  {item.excerpt}
                </p>

                {/* Author & Arrow */}
                <div className="pt-4 border-t border-outline-variant/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold text-[10px]">
                      {item.initials}
                    </div>
                    <span className="text-sm font-semibold text-on-surface">{item.author}</span>
                  </div>
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center py-12 bg-white rounded-xl border border-outline-variant/30">
          <span className="material-symbols-outlined text-5xl text-outline mb-4">search_off</span>
          <h3 className="text-xl font-bold text-primary mb-2">Tidak Ada Berita Ditemukan</h3>
          <p className="text-sm text-on-surface-variant max-w-sm">
            Coba ubah kata kunci pencarian atau pilih kategori lain.
          </p>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-12 md:mt-16 flex justify-center">
        <nav className="flex items-center gap-2">
          <button
            onClick={() => setActivePaginationPage(Math.max(1, activePaginationPage - 1))}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setActivePaginationPage(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activePaginationPage === page
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {page}
            </button>
          ))}

          <span className="px-2 text-outline">...</span>

          <button
            onClick={() => setActivePaginationPage(8)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activePaginationPage === 8
                ? 'bg-primary text-on-primary shadow-md'
                : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            8
          </button>

          <button
            onClick={() => setActivePaginationPage(Math.min(8, activePaginationPage + 1))}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </nav>
      </div>
    </main>
  );
}
