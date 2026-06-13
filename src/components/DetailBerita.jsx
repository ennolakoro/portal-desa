import { useState, useEffect } from 'react';

const sidebarPopular = [
  {
    id: 'detail-main',
    title: 'Sosialisasi Pemanfaatan Lahan Pekarangan',
    date: '20 Okt 2026',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsr1eHevnD3r_TCClhi8sjJ7k4ETuHCvG11EMVB6G9dy9B52LJufiQBnKV7xW-WpC1RHjBeTWHSRR08ri_PA60MbWTIMdn914Ed_IhtmuNgdEqZBQp6ypJbpSj2h8OsmyLsFEyD2x6QI88_CMZ9RPgboUuhtLEaxB82xn3tZBnQ_RYvMuSTx0z-IenSYIhuCnt-mRtsxRqAFhyzTT5EkRcPilN7-iwBhyW9jMOgmwz4Ru9b7cuv_tfagHQPfYvVI55THoCm7ZKv0cY'
  },
  {
    id: 'detail-main',
    title: 'Layanan Posyandu Lansia Dusun Utara',
    date: '18 Okt 2026',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFYaetQfFQ8FKj-DQuJcA5tKRxeH_ozs8bCK1C1DvgO-ohKWgUSn7Z0J0kjikGTi_v1dQ1ST3opmAXgmVvK5aqVbCGKqEV57rY-lRoZK88WDagPAUv5VXp3FH4uAWjT2SiNybfWrO-HmNcCppEnIbsVl76qch9tySmi6POuLZmC2ELJ2SBl39g8onF9AINSIks3cm4OOoMa0aM5w93XczgdBfcmgxQUDJ0hWxUmnNv2b54HBqZQCV-vmFc0GQT8s5JC7URpuIfvPIT'
  },
  {
    id: 'detail-main',
    title: 'Musyawarah Desa Penetapan RKPDes 2027',
    date: '15 Okt 2026',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5TyCUUOc3Jshtv8aMmzzcRMLlX5yrulPTFWHMkc6q-312GmS35OvSO6ZmDJRFLphmu-CN7a4JYXKYwwFTe16Carp8t0vusszmfzA-W4lijI_nwX34zu5jC42s1_36i0mvQ-XXojCkFf3RmsjjIFswTlv3bBXGR6ktrwMFAPm5luxJtCKDQz1x-B4P0bZAkkksQtw3lCAx78gXX-eoPn-PSXkRSI4WVq3BVW_h8Mi0Om9ImTBhoGUx5u4MKxqKLlgAKu7oFKtEUV59'
  }
];

const categories = ['Pemerintahan', 'Ekonomi', 'Kesehatan', 'Pendidikan', 'Wisata', 'Teknologi'];

export default function DetailBerita({ newsId = '1', setCurrentPage, setSelectedNewsId }) {
  const [newsItem, setNewsItem] = useState(null);
  const [popularNews, setPopularNews] = useState([]);

  useEffect(() => {
    // Scroll smoothly to top when opening detail page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Fetch individual news details
    if (newsId && newsId !== 'detail-main') {
      fetch(`http://localhost:8000/api/v1/berita/${newsId}`)
        .then(res => res.json())
        .then(data => setNewsItem(data))
        .catch(err => console.error(err));
    } else {
      // Fallback: fetch list and get first
      fetch(`http://localhost:8000/api/v1/berita`)
        .then(res => res.json())
        .then(data => setNewsItem(data[0]))
        .catch(err => console.error(err));
    }

    // Fetch popular news
    fetch(`http://localhost:8000/api/v1/berita`)
        .then(res => res.json())
        .then(data => {
            const sorted = data.sort((a,b) => b.views - a.views).slice(0,3);
            setPopularNews(sorted);
        })
        .catch(err => console.error(err));
  }, [newsId]);

  if (!newsItem) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <main className="animate-fade-in max-w-[1280px] mx-auto px-4 md:px-10 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-on-surface-variant font-semibold text-sm">
        <button 
          onClick={() => setCurrentPage('home')}
          className="hover:text-primary transition-colors cursor-pointer"
        >
          Home
        </button>
        <span className="material-symbols-outlined text-[16px] text-outline-variant">chevron_right</span>
        <button 
          onClick={() => setCurrentPage('berita')}
          className="hover:text-primary transition-colors cursor-pointer"
        >
          Berita
        </button>
        <span className="material-symbols-outlined text-[16px] text-outline-variant">chevron_right</span>
        <span className="text-primary font-bold">Detail Berita</span>
      </nav>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Article Area */}
        <article className="lg:col-span-8 space-y-8 bg-white p-6 md:p-8 rounded-xl border border-outline-variant/30 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          {/* Header Info */}
          <section className="space-y-4">
            <span className="inline-block px-3.5 py-1 bg-primary-container text-on-primary-container font-bold text-xs uppercase tracking-wider rounded-full">
              {newsItem.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-primary leading-tight">
              {newsItem.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-on-surface-variant text-xs font-semibold pt-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
                <span>{new Date(newsItem.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                <span>{newsItem.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">visibility</span>
                <span>{newsItem.views} Dilihat</span>
              </div>
            </div>
          </section>

          {/* Featured Image */}
          <div className="rounded-xl overflow-hidden shadow-md aspect-video md:h-[400px] w-full">
            <img 
              alt={newsItem.title} 
              className="w-full h-full object-cover" 
              src={newsItem.image}
            />
          </div>

          <div className="text-on-surface-variant text-base md:text-lg space-y-6 leading-relaxed news-body-content">
            {Array.isArray(newsItem.body) ? (
              newsItem.body.map((para, index) => {
                // Third element is quote in the design mockup
                if (index === 2) {
                  return (
                    <blockquote 
                      key={index}
                      className="border-l-4 border-primary pl-6 py-3 italic bg-surface-container-low rounded-r-lg font-bold text-primary text-lg md:text-xl my-8"
                    >
                      "{para}"
                    </blockquote>
                  );
                }
                return (
                  <p key={index}>
                    {para}
                  </p>
                );
              })
            ) : (
              <div dangerouslySetInnerHTML={{ __html: newsItem.body }} />
            )}
          </div>

          {/* Share Section */}
          <section className="border-t border-outline-variant/30 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-lg md:text-xl font-bold text-primary">
              Bagikan Berita Ini
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => alert('Berbagi ke Facebook...')}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] text-white text-xs font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">share</span>
                <span>Facebook</span>
              </button>
              <button 
                onClick={() => alert('Berbagi ke Twitter / X...')}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1DA1F2] text-white text-xs font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">share</span>
                <span>Twitter</span>
              </button>
              <button 
                onClick={() => alert('Berbagi ke WhatsApp...')}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white text-xs font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                <span>WhatsApp</span>
              </button>
            </div>
          </section>
        </article>

        {/* Sidebar Area */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Search Box */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/30">
            <h3 className="text-lg font-bold text-primary mb-4">Cari Berita</h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ketik kata kunci..." 
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-surface text-sm"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                search
              </span>
            </div>
          </div>

          {/* Popular / Latest News */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/30">
            <h3 className="text-lg font-bold text-primary mb-6">Berita Terpopuler</h3>
            <div className="space-y-6">
              {popularNews.map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => {
                    setSelectedNewsId(item.id);
                    setCurrentPage('detail-berita');
                  }}
                  className="group flex gap-4 cursor-pointer"
                >
                  <img 
                    alt={item.title} 
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0 group-hover:opacity-80 transition-opacity" 
                    src={item.image}
                  />
                  <div className="space-y-1 my-auto">
                    <h4 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-on-surface-variant font-medium">
                      {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setCurrentPage('berita')}
              className="w-full mt-8 py-3 border border-primary text-primary font-bold text-xs rounded-lg hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
            >
              Lihat Semua Berita
            </button>
          </div>

          {/* Category List */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/30">
            <h3 className="text-lg font-bold text-primary mb-4">Kategori Berita</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCurrentPage('berita');
                  }}
                  className="px-3 py-1.5 bg-surface-container text-on-surface-variant font-bold text-[11px] rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
}
