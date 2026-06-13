import { useState, useEffect, useRef } from 'react';

export default function KelolaGaleriForm({ token }) {
  const [galleries, setGalleries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState('');
  const [keterangan, setKeterangan] = useState('');

  // Lightbox states
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxTitle, setLightboxTitle] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/gallery', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Gagal mengambil data galeri');
      const data = await res.json();
      setGalleries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openUploadModal = () => {
    setShowUploadModal(true);
    setUploadFile(null);
    setUploadPreview('');
    setKeterangan('');
    setError(null);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadPreview('');
    setKeterangan('');
    setError(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setError('Silakan pilih foto terlebih dahulu.');
      return;
    }

    setIsUploading(true);
    setError(null);

    const uploadData = new FormData();
    uploadData.append('image', uploadFile);
    uploadData.append('alt', keterangan || 'Galeri Foto Desa');
    uploadData.append('keterangan', keterangan || '');

    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/gallery', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: uploadData
      });

      if (!res.ok) throw new Error('Gagal mengunggah foto');
      
      closeUploadModal();
      await fetchGalleries();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus foto ini dari galeri desa?')) return;

    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Gagal menghapus foto');
      await fetchGalleries();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = async (img) => {
    const newKeterangan = window.prompt('Ubah keterangan foto:', img.keterangan || img.alt || '');
    if (newKeterangan === null) return; // User cancelled

    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/gallery/${img.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          keterangan: newKeterangan
        })
      });

      if (!res.ok) throw new Error('Gagal memperbarui keterangan');
      await fetchGalleries();
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-on-surface-variant animate-pulse">Memuat foto galeri...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header and Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Kelola Galeri Desa</h1>
          <p className="text-sm text-on-surface-variant mt-1">Kelola arsip visual dan momen dokumentasi kegiatan Desa Dumbaya Bulan.</p>
        </div>

        {/* Upload Form */}
        <div className="flex items-center">
          <button
            onClick={openUploadModal}
            className="flex-shrink-0 flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-colors font-bold text-sm cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
            Tambah Foto
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Grid of gallery images */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30">
        {galleries.length === 0 ? (
          <div className="py-16 text-center text-on-surface-variant space-y-2">
            <span className="material-symbols-outlined text-outline text-5xl">photo_library</span>
            <p className="font-medium text-sm">Belum ada foto di galeri desa.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {galleries.map(img => (
              <div 
                key={img.id}
                className="group relative aspect-square rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm bg-surface-container"
              >
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => {
                    setLightboxImage(img.src);
                    setLightboxTitle(img.keterangan || img.alt || 'Galeri');
                  }}
                />
                
                {/* Alt Overlay in bottom */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-3 pt-8 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                  <p className="text-[11px] text-white font-medium line-clamp-2 leading-tight" title={img.keterangan || img.alt}>
                    {img.keterangan || img.alt}
                  </p>
                </div>

                {/* Edit & Delete buttons top right */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
                  <button
                    onClick={() => handleEdit(img)}
                    className="w-8 h-8 rounded-lg bg-surface text-primary hover:bg-primary-container shadow-md flex items-center justify-center cursor-pointer transition-colors"
                    title="Ubah Keterangan"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="w-8 h-8 rounded-lg bg-error text-on-error hover:bg-error-container hover:text-on-error-container shadow-md flex items-center justify-center cursor-pointer transition-colors"
                    title="Hapus dari Galeri"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
              <h3 className="font-bold text-lg text-primary">Unggah Foto Baru</h3>
              <button onClick={closeUploadModal} className="text-on-surface-variant hover:text-error transition-colors rounded-full p-1 cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-5">
              {error && (
                <div className="bg-error-container text-on-error-container text-xs p-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Photo Preview & Input */}
              <div>
                <label className="block text-sm font-semibold mb-2">Pilih Foto</label>
                <div 
                  className="w-full aspect-video rounded-xl border-2 border-dashed border-outline-variant flex items-center justify-center overflow-hidden bg-surface-container relative cursor-pointer hover:bg-surface-container-high transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadPreview ? (
                    <img src={uploadPreview} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center text-on-surface-variant p-4">
                      <span className="material-symbols-outlined text-4xl mb-1">add_photo_alternate</span>
                      <p className="text-sm font-medium">Klik untuk mencari foto</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-full">Ganti Foto</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  className="hidden" 
                />
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-sm font-semibold mb-2">Keterangan Foto</label>
                <textarea 
                  rows="3"
                  value={keterangan}
                  onChange={e => setKeterangan(e.target.value)}
                  className="w-full p-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-colors outline-none"
                  placeholder="Masukkan keterangan foto galeri..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={closeUploadModal}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isUploading || !uploadFile}
                  className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-primary text-white hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isUploading ? (
                    <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Mengunggah...</>
                  ) : (
                    <><span className="material-symbols-outlined text-[18px]">upload</span> Simpan</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div className="absolute top-4 right-4">
            <button 
              className="text-white hover:text-primary transition-colors bg-white/10 hover:bg-white/20 p-2.5 rounded-full cursor-pointer flex items-center justify-center border-none"
              onClick={() => setLightboxImage(null)}
              title="Tutup"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
          
          <div 
            className="max-w-[90vw] max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl relative border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={lightboxImage} 
              alt={lightboxTitle} 
              className="w-full h-full object-contain max-h-[80vh] animate-scale-up" 
            />
          </div>
          
          <h4 className="text-white font-bold mt-4 text-lg text-center tracking-wide uppercase">
            {lightboxTitle}
          </h4>
        </div>
      )}

    </div>
  );
}
