import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import QuickLinks from './components/QuickLinks';
import LeaderGreeting from './components/LeaderGreeting';
import MapAndStats from './components/MapAndStats';
import NewsSection from './components/NewsSection';
import PotentialAndTourism from './components/PotentialAndTourism';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import FloatingStats from './components/FloatingStats';
import ProfilDesa from './components/ProfilDesa';
import Infografis from './components/Infografis';
import Listing from './components/Listing';
import Berita from './components/Berita';
import DetailBerita from './components/DetailBerita';
import Galeri from './components/Galeri';
import FotoSlider from './components/FotoSlider';

import { useEffect } from 'react';

const getPageFromPath = (path) => {
  if (path === '/' || path === '') return 'home';
  if (path === '/profil-desa') return 'profil';
  if (path === '/berita') return 'berita';
  if (path.startsWith('/infografis')) return 'infografis';
  if (path === '/listing') return 'listing';
  if (path === '/idm') return 'infografis';
  if (path === '/galeri') return 'galeri';
  if (path.startsWith('/detail-berita')) return 'detail-berita';
  return 'home';
};

const getPathFromPage = (page, extra = null) => {
  if (page === 'home') return '/';
  if (page === 'profil') return '/profil-desa';
  if (page === 'berita') return '/berita';
  if (page === 'infografis') return extra ? `/infografis/${extra}` : '/infografis/penduduk';
  if (page === 'listing') return '/listing';
  if (page === 'idm') return '/infografis/idm';
  if (page === 'galeri') return '/galeri';
  if (page === 'detail-berita') return `/detail-berita?id=${extra || 'detail-main'}`;
  return '/';
};

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => getPageFromPath(window.location.pathname));
  const [selectedNewsId, setSelectedNewsId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || 'detail-main';
  });

  useEffect(() => {
    const handlePopState = () => {
      const page = getPageFromPath(window.location.pathname);
      setCurrentPage(page);
      if (page === 'detail-berita') {
        const params = new URLSearchParams(window.location.search);
        setSelectedNewsId(params.get('id') || 'detail-main');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page, extra = null) => {
    const url = getPathFromPage(page, extra);
    window.history.pushState(null, '', url);
    setCurrentPage(page);
    if (page === 'detail-berita' && extra) {
      setSelectedNewsId(extra);
    }
  };

  const handleSetPage = (page, extra = null) => {
    if (page === 'detail-berita') {
      navigateTo('detail-berita', extra || selectedNewsId);
    } else {
      navigateTo(page, extra);
    }
  };

  const handleSetNewsId = (id) => {
    setSelectedNewsId(id);
    const url = `/detail-berita?id=${id}`;
    window.history.pushState(null, '', url);
  };

  return (
    <div className="bg-surface text-on-surface font-sans antialiased min-h-screen">
      {/* Header (index header style preserved, dynamically routing) */}
      <Header currentPage={currentPage} setCurrentPage={handleSetPage} />

      {currentPage === 'home' ? (
        <>
          {/* Hero Section */}
          <Hero />

          {/* Main Content */}
          <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 space-y-24">
            {/* Quick Links */}
            <QuickLinks />

            {/* Leader Greeting */}
            <LeaderGreeting />

            {/* Map & Statistics */}
            <MapAndStats setCurrentPage={handleSetPage} />

            {/* Foto Slider */}
            <FotoSlider />

            {/* News Section */}
            <NewsSection setCurrentPage={handleSetPage} setSelectedNewsId={handleSetNewsId} />

            {/* Potential & Tourism */}
            <PotentialAndTourism />

            {/* Gallery */}
            <Gallery setCurrentPage={handleSetPage} />
          </main>
        </>
      ) : currentPage === 'profil' ? (
        <ProfilDesa />
      ) : (currentPage === 'infografis' || currentPage === 'idm') ? (
        <Infografis />
      ) : currentPage === 'listing' ? (
        <Listing />
      ) : currentPage === 'berita' ? (
        <Berita setCurrentPage={handleSetPage} setSelectedNewsId={handleSetNewsId} />
      ) : currentPage === 'detail-berita' ? (
        <DetailBerita newsId={selectedNewsId} setCurrentPage={handleSetPage} setSelectedNewsId={handleSetNewsId} />
      ) : currentPage === 'galeri' ? (
        <Galeri setCurrentPage={handleSetPage} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-4">
          <span className="material-symbols-outlined text-6xl text-primary mb-4 animate-bounce">
            construction
          </span>
          <h2 className="text-3xl font-bold text-primary mb-2">Halaman Sedang Dibuat</h2>
          <p className="text-on-surface-variant max-w-md">
            Halaman "{currentPage.toUpperCase()}" sedang dalam tahap pengembangan. Silakan kembali ke halaman utama atau profil desa.
          </p>
          <button 
            onClick={() => handleSetPage('home')}
            className="mt-6 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold shadow-md cursor-pointer hover:bg-primary-container transition-all"
          >
            Kembali ke Home
          </button>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Floating Stats */}
      <FloatingStats />
    </div>
  );
}
