import { useState } from 'react';

const navLinks = [
  { label: 'Home', id: 'home' },
  { label: 'Profil Desa', id: 'profil' },
  { label: 'Berita', id: 'berita' },
  { label: 'Infografis', id: 'infografis' },
  { label: 'Listing', id: 'listing' },
  { label: 'IDM', id: 'idm' },
  { label: 'Layanan Surat', id: 'layanan-surat' },
];

export default function Header({ currentPage = 'home', setCurrentPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-on-primary sticky top-0 z-50 shadow-lg">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex justify-between items-center h-20">
        {/* Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setCurrentPage('home')}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
            <img src="/logoo.png" alt="Logo Desa Dumbayabulan" className="w-full h-full object-contain" />
          </div>
          <span className="font-semibold text-xl md:text-2xl tracking-tight">
            Desa Dumbayabulan
            <span className="block text-xs font-medium opacity-80">Kabupaten Bone Bolango</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              (link.id === 'idm' && window.location.pathname === '/infografis/idm') ||
              (link.id === 'infografis' && window.location.pathname.startsWith('/infografis') && window.location.pathname !== '/infografis/idm') ||
              (currentPage === link.id && link.id !== 'idm' && link.id !== 'infografis');
            return (
              <button
                key={link.label}
                className={`relative font-medium transition-colors cursor-pointer text-base py-2 ${isActive
                    ? 'text-primary-fixed font-bold nav-link-active'
                    : 'text-on-primary/80 hover:text-primary-fixed'
                  }`}
                onClick={() => setCurrentPage(link.id)}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <nav className="px-4 pb-6 space-y-1 border-t border-white/10">
          {navLinks.map((link) => {
            const isActive =
              (link.id === 'idm' && window.location.pathname === '/infografis/idm') ||
              (link.id === 'infografis' && window.location.pathname.startsWith('/infografis') && window.location.pathname !== '/infografis/idm') ||
              (currentPage === link.id && link.id !== 'idm' && link.id !== 'infografis');
            return (
              <button
                key={link.label}
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer ${isActive
                    ? 'bg-white/10 text-primary-fixed'
                    : 'text-on-primary/70 hover:bg-white/5 hover:text-primary-fixed'
                  }`}
                onClick={() => {
                  setCurrentPage(link.id);
                  setMobileMenuOpen(false);
                }}
              >
                {link.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
