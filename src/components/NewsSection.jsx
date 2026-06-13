import { useState, useEffect } from 'react';

export default function NewsSection({ setCurrentPage, setSelectedNewsId }) {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/berita')
      .then(res => res.json())
      .then(data => setNewsData(data.slice(0, 2))) // Get latest 2 news
      .catch(err => console.error(err));
  }, []);

  return (
    <section>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <span className="text-primary font-bold text-xs tracking-widest uppercase mb-2 block">
            Informasi Terkini
          </span>
          <h2 className="text-primary font-semibold text-4xl tracking-tight">
            Berita & Pengumuman
          </h2>
        </div>
        <button
          onClick={() => setCurrentPage('berita')}
          className="px-6 py-3 bg-white border border-outline-variant/40 rounded-lg font-bold text-primary flex items-center gap-3 hover:bg-surface-container transition-all cursor-pointer"
        >
          Lihat Semua Berita{' '}
          <span className="material-symbols-outlined text-primary">chevron_right</span>
        </button>
      </div>

      {/* News Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {newsData.map((news) => (
          <article
            key={news.id}
            onClick={() => {
              setSelectedNewsId(news.id);
              setCurrentPage('detail-berita');
            }}
            className="group bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant/30 hover:shadow-2xl transition-all duration-500 cursor-pointer"
          >
            <div className="relative h-72 overflow-hidden">
              <img
                alt={news.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                src={news.image}
              />
              <div className="absolute top-6 left-6 bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                {news.category}
              </div>
            </div>
            <div className="p-10">
              <div className="flex items-center gap-6 text-xs text-on-surface-variant mb-6 font-medium">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">person</span> {news.author}
                </span>
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">calendar_today</span>{' '}
                  {new Date(news.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <h3 className="text-primary font-semibold text-2xl mb-4 group-hover:text-primary-container transition-colors leading-snug">
                {news.title}
              </h3>
              <p className="text-on-surface-variant text-base line-clamp-2 leading-relaxed mb-8">
                {news.excerpt}
              </p>
              <div className="h-0.5 w-12 bg-outline-variant group-hover:w-full group-hover:bg-primary transition-all duration-500"></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
