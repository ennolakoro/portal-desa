import { useState, useEffect } from 'react';

export default function LeaderGreeting() {
  const [greeting, setGreeting] = useState(null);

  useEffect(() => {
    fetch('https://api.desadumbayabulan.my.id/api/v1/leader-greeting')
      .then(res => res.json())
      .then(data => setGreeting(data))
      .catch(err => console.error(err));
  }, []);

  if (!greeting) return null;

  return (
    <section className="relative animate-fade-in">
      {/* Decorative Blur */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary-fixed/10 rounded-full blur-3xl -z-10"></div>

      <div className="bg-white rounded-xl p-8 md:p-12 shadow-2xl shadow-primary/5 border border-outline-variant/20 flex flex-col lg:flex-row items-center gap-12">
        {/* Photo */}
        <div className="relative flex-shrink-0">
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-primary-fixed rounded-full opacity-20"></div>
          <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-xl relative z-10 bg-surface-container flex items-center justify-center">
            {greeting.photo ? (
              <img
                alt="Kepala Desa"
                className="w-full h-full object-cover"
                src={greeting.photo}
              />
            ) : (
              <span className="material-symbols-outlined text-outline text-7xl">person</span>
            )}
          </div>
        </div>

        {/* Text */}
        <div className="flex-grow text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold mb-6">
            <span className="material-symbols-outlined text-sm">chat_bubble</span> SAMBUTAN HANGAT
          </div>
          <h3 className="text-primary font-semibold text-3xl mb-2 tracking-tight">
            Pesan Kepala Desa Desa Dumbaya Bulan
          </h3>
          <h4 className="text-secondary font-semibold text-xl mb-8">{greeting.name || 'Kepala Desa'}</h4>
          <div className="relative">
            <span className="material-symbols-outlined text-6xl text-primary/5 absolute -top-8 -left-8 pointer-events-none">
              format_quote
            </span>
            <p className="text-on-surface-variant text-xl italic leading-relaxed relative z-10">
              &ldquo;{greeting.content || ''}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
