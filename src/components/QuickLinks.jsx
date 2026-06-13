const quickLinks = [
  { icon: 'account_balance', label: 'PROFIL DESA', href: '#profil' },
  { icon: 'monitoring', label: 'INFOGRAFIS', href: '#infografis' },
  { icon: 'stars', label: 'IDM', href: '#idm' },
  { icon: 'format_list_bulleted', label: 'LISTING', href: '#listing' },
];

export default function QuickLinks() {
  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Description */}
        <div className="lg:col-span-4">
          <h2 className="text-primary font-semibold text-3xl mb-6 tracking-tight">Navigasi Utama</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Akses cepat ke berbagai pilar informasi desa mulai dari profil resmi hingga transparansi
            data publik.
          </p>
          <div className="mt-8 h-1 w-20 bg-primary-fixed-dim rounded-full"></div>
        </div>

        {/* Right Grid */}
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              className="group p-8 rounded-xl bg-white shadow-sm border border-outline-variant/30 hover:border-primary hover:shadow-xl transition-all duration-300 text-center"
              href={link.href}
            >
              <div className="w-16 h-16 bg-surface-container rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition-colors duration-300">
                <span className="material-symbols-outlined text-4xl text-primary group-hover:text-white transition-colors duration-300">
                  {link.icon}
                </span>
              </div>
              <span className="font-bold text-primary tracking-wide text-sm">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
