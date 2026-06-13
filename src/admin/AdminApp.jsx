import { useState, useEffect } from 'react';
import Login from './Login';
import AdminLayout from './AdminLayout';
import ProfilDesaForm from './ProfilDesaForm';
import KelolaWargaForm from './KelolaWargaForm';
import KelolaApbdesForm from './KelolaApbdesForm';
import KelolaBeritaForm from './KelolaBeritaForm';
import KelolaSambutanForm from './KelolaSambutanForm';
import KelolaGaleriForm from './KelolaGaleriForm';
import KelolaPetaForm from './KelolaPetaForm';
import KelolaIdmForm from './KelolaIdmForm';
import DashboardOverview from './DashboardOverview';
import KelolaPengaturanForm from './KelolaPengaturanForm';
import KelolaKunjunganForm from './KelolaKunjunganForm';
import KelolaPotensiForm from './KelolaPotensiForm';
import KelolaStuntingForm from './KelolaStuntingForm';
import KelolaBansosForm from './KelolaBansosForm';
import KelolaFotoSliderForm from './KelolaFotoSliderForm';
import KelolaPermohonanSuratForm from './KelolaPermohonanSuratForm';


const getTabFromPath = (path) => {
  if (path === '/admin/profil') return 'profil';
  if (path === '/admin/peta') return 'peta';
  if (path === '/admin/kelola-warga') return 'kelola-warga';
  if (path === '/admin/kelola-apbdes') return 'kelola-apbdes';
  if (path === '/admin/berita') return 'berita';
  if (path === '/admin/sambutan') return 'sambutan';
  if (path === '/admin/galeri') return 'galeri';
  if (path === '/admin/idm') return 'idm';
  if (path === '/admin/pengaturan') return 'pengaturan';
  if (path === '/admin/visitor-stats') return 'kunjungan';
  if (path === '/admin/potensi') return 'potensi';
  if (path === '/admin/stunting') return 'stunting';
  if (path === '/admin/bansos') return 'bansos';
  if (path === '/admin/foto-slider') return 'foto-slider';
  if (path === '/admin/permohonan-surat') return 'permohonan-surat';
  return 'dashboard';
};

const getPathFromTab = (tab) => {
  if (tab === 'profil') return '/admin/profil';
  if (tab === 'peta') return '/admin/peta';
  if (tab === 'kelola-warga') return '/admin/kelola-warga';
  if (tab === 'kelola-apbdes') return '/admin/kelola-apbdes';
  if (tab === 'berita') return '/admin/berita';
  if (tab === 'sambutan') return '/admin/sambutan';
  if (tab === 'galeri') return '/admin/galeri';
  if (tab === 'idm') return '/admin/idm';
  if (tab === 'pengaturan') return '/admin/pengaturan';
  if (tab === 'kunjungan') return '/admin/visitor-stats';
  if (tab === 'potensi') return '/admin/potensi';
  if (tab === 'stunting') return '/admin/stunting';
  if (tab === 'bansos') return '/admin/bansos';
  if (tab === 'foto-slider') return '/admin/foto-slider';
  if (tab === 'permohonan-surat') return '/admin/permohonan-surat';
  return '/admin';
};

export default function AdminApp() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [activeTab, setActiveTab] = useState(() => getTabFromPath(window.location.pathname));

  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token);
    } else {
      localStorage.removeItem('adminToken');
    }
  }, [token]);

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToTab = (tab) => {
    const url = getPathFromTab(tab);
    window.history.pushState(null, '', url);
    setActiveTab(tab);
  };

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <AdminLayout setToken={setToken} activeTab={activeTab} setActiveTab={navigateToTab}>
      {activeTab === 'dashboard' && (
        <DashboardOverview token={token} setActiveTab={navigateToTab} />
      )}
      {activeTab === 'profil' && (
        <ProfilDesaForm token={token} />
      )}
      {activeTab === 'peta' && (
        <KelolaPetaForm token={token} />
      )}
      {activeTab === 'kelola-warga' && (
        <KelolaWargaForm token={token} />
      )}
      {activeTab === 'kelola-apbdes' && (
        <KelolaApbdesForm token={token} />
      )}
      {activeTab === 'berita' && (
        <KelolaBeritaForm token={token} />
      )}
      {activeTab === 'sambutan' && (
        <KelolaSambutanForm token={token} />
      )}
      {activeTab === 'galeri' && (
        <KelolaGaleriForm token={token} />
      )}
      {activeTab === 'idm' && (
        <KelolaIdmForm token={token} />
      )}
      {activeTab === 'pengaturan' && (
        <KelolaPengaturanForm token={token} />
      )}
      {activeTab === 'kunjungan' && (
        <KelolaKunjunganForm token={token} />
      )}
      {activeTab === 'potensi' && (
        <KelolaPotensiForm token={token} />
      )}
      {activeTab === 'stunting' && (
        <KelolaStuntingForm token={token} />
      )}
      {activeTab === 'bansos' && (
        <KelolaBansosForm token={token} />
      )}
      {activeTab === 'foto-slider' && (
        <KelolaFotoSliderForm token={token} />
      )}
      {activeTab === 'permohonan-surat' && (
        <KelolaPermohonanSuratForm token={token} />
      )}
    </AdminLayout>
  );
}
