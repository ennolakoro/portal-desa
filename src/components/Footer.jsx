import { useState, useEffect } from 'react';

export default function Footer() {
  const [settings, setSettings] = useState({
    footer_alamat_kantor: '[Alamat kantor]',
    footer_detail_alamat: 'Kecamatan Kabila Bone, Kabupaten Bone Bolango, Provinsi Gorontalo, 96553',
    footer_kode_wilayah: '75.03.08.2003',
    footer_telepon: '08xxxxxxxxxx',
    footer_email: 'emaildesa@digitaldesa.id',
    footer_emergency_text: 'Butuh bantuan segera? Hubungi pusat bantuan desa kami.',
    footer_emergency_phone: '08xxxxxxxxxx',
    footer_link_kemendesa: '#',
    footer_link_kemendagri: '#',
    footer_link_dpt: '#'
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/desa-setting')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings(data);
        }
      })
      .catch(err => console.error('Error fetching settings for footer:', err));
  }, []);

  return (
    <>
      <footer className="bg-primary text-on-primary mt-32">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            {/* Brand & Info */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-fixed rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary font-bold">
                    account_balance
                  </span>
                </div>
                <span className="text-2xl font-bold">Desa Dumbaya Bulan</span>
              </div>
              <div className="text-on-primary/70 space-y-4 leading-relaxed">
                <p>{settings.footer_alamat_kantor}</p>
                <p>
                  {settings.footer_detail_alamat}
                </p>
                <div className="pt-2">
                  <span className="bg-white/10 px-4 py-2 rounded-lg font-bold text-primary-fixed">
                    Kode Wilayah: {settings.footer_kode_wilayah}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-8">
              <h4 className="text-xl font-bold border-l-4 border-primary-fixed pl-4">
                Hubungi Kami
              </h4>
              <div className="space-y-4">
                <a
                  className="flex items-center gap-4 text-on-primary/70 hover:text-white transition-colors group"
                  href={`tel:${settings.footer_telepon}`}
                >
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-primary-fixed group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">call</span>
                  </div>
                  {settings.footer_telepon}
                </a>
                <a
                  className="flex items-center gap-4 text-on-primary/70 hover:text-white transition-colors group"
                  href={`mailto:${settings.footer_email}`}
                >
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-primary-fixed group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">mail</span>
                  </div>
                  {settings.footer_email}
                </a>
              </div>
            </div>

            {/* Emergency */}
            <div className="space-y-8">
              <h4 className="text-xl font-bold border-l-4 border-primary-fixed pl-4">
                Layanan Darurat
              </h4>
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <p className="text-on-primary/70 italic text-base mb-4 leading-relaxed">
                  {settings.footer_emergency_text}
                </p>
                <a
                  href={`tel:${settings.footer_emergency_phone}`}
                  className="w-full py-3 bg-primary-container text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-primary/80 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">phone_in_talk</span> Hubungi Call Center
                </a>
              </div>
            </div>

            {/* Related Links */}
            <div className="space-y-8">
              <h4 className="text-xl font-bold border-l-4 border-primary-fixed pl-4">
                Tautan Terkait
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    className="text-on-primary/70 hover:text-primary-fixed transition-colors flex items-center gap-2"
                    href={settings.footer_link_kemendesa}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="material-symbols-outlined text-sm">link</span> Website Kemendesa
                  </a>
                </li>
                <li>
                  <a
                    className="text-on-primary/70 hover:text-primary-fixed transition-colors flex items-center gap-2"
                    href={settings.footer_link_kemendagri}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="material-symbols-outlined text-sm">link</span> Website Kemendagri
                  </a>
                </li>
                <li>
                  <a
                    className="text-on-primary/70 hover:text-primary-fixed transition-colors flex items-center gap-2"
                    href={settings.footer_link_dpt}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="material-symbols-outlined text-sm">link</span> Cek DPT Online
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 bg-black/20">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-on-primary/50 text-xs font-medium">
              © 2026 Pemerintah Desa Dumbaya Bulan. Powered by Desa Dumbaya Bulan
            </p>
            <div className="flex gap-4">
              <button className="bg-white/5 hover:bg-white/10 px-6 py-2.5 rounded-full text-white text-xs font-bold flex items-center gap-2 border border-white/10 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-lg">support_agent</span> PENGADUAN
                WARGA
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
