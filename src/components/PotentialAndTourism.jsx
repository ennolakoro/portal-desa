import { useState, useEffect } from 'react';

export default function PotentialAndTourism() {
  const [items, setItems] = useState([]);
  const [activeWisataIndex, setActiveWisataIndex] = useState(0);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('https://api.desadumbayabulan.my.id/api/v1/potensi-wisata');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (e) {
      console.error('Gagal mengambil data potensi & wisata', e);
    }
  };

  const potensiItems = items.filter(item => item.type === 'potensi');
  const wisataItems = items.filter(item => item.type === 'wisata');

  const nextWisata = () => {
    if (wisataItems.length > 0) {
      setActiveWisataIndex((prev) => (prev + 1) % wisataItems.length);
    }
  };

  const prevWisata = () => {
    if (wisataItems.length > 0) {
      setActiveWisataIndex((prev) => (prev - 1 + wisataItems.length) % wisataItems.length);
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Left - Potential */}
      <div className="bg-primary-container/10 rounded-2xl p-8 lg:p-12 flex flex-col justify-between border border-primary/5 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary text-3xl font-bold">explore</span>
            <h2 className="text-primary font-bold text-3xl tracking-tight">Potensi Desa</h2>
          </div>
          <p className="text-on-surface-variant text-lg mb-8 leading-relaxed">
            Desa Dumbayabulan dianugerahi kekayaan alam melimpah serta kreativitas masyarakat yang luar biasa dalam memajukan perekonomian desa.
          </p>

          {potensiItems.length === 0 ? (
            <div className="bg-white/40 border-2 border-dashed border-primary/10 rounded-xl p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-primary/20 mb-3 animate-pulse">
                inventory_2
              </span>
              <p className="text-primary/40 font-medium italic">Data potensi sedang diperbarui</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {potensiItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white hover:bg-primary-container/5 p-5 rounded-xl border border-primary/5 hover:border-primary/20 shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-primary/5 group-hover:bg-primary/15 w-10 h-10 rounded-lg flex items-center justify-center text-primary transition-colors">
                      <span className="material-symbols-outlined font-bold">
                        {item.icon || 'star'}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-primary tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-on-surface-variant text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right - Tourism (Interactive Slide Show) */}
      <div className="relative rounded-2xl overflow-hidden h-[500px] lg:h-auto group shadow-2xl border border-white/10">
        {wisataItems.length === 0 ? (
          <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center p-8 text-center text-white">
            <span className="material-symbols-outlined text-6xl text-white/30 mb-4 animate-bounce">
              photo_library
            </span>
            <h3 className="text-xl font-bold mb-2">Wisata Desa</h3>
            <p className="text-white/60 text-sm max-w-xs">Destinasi wisata sedang dipetakan oleh tim IT desa.</p>
          </div>
        ) : (
          <>
            {wisataItems.map((item, index) => (
              <div
                key={item.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === activeWisataIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[4s]"
                  src={item.image_url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent"></div>
                
                <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-end text-white">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit mb-3 border border-white/10">
                    Wisata Bahari & Alam
                  </span>
                  <h2 className="text-white font-extrabold text-3xl lg:text-4xl mb-3 tracking-tight">
                    {item.title}
                  </h2>
                  <p className="text-white/80 text-sm lg:text-base mb-6 max-w-md leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Slider Controls */}
            {wisataItems.length > 1 && (
              <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={prevWisata}
                  className="w-10 h-10 bg-black/30 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button 
                  onClick={nextWisata}
                  className="w-10 h-10 bg-black/30 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}

            {/* Slide Indicators */}
            {wisataItems.length > 1 && (
              <div className="absolute bottom-6 right-6 flex gap-2 z-20">
                {wisataItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveWisataIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activeWisataIndex ? 'w-6 bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
