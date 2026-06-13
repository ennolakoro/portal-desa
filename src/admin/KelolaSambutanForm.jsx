import { useState, useEffect, useRef } from 'react';

export default function KelolaSambutanForm({ token }) {
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    photo: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchGreeting();
  }, []);

  const fetchGreeting = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://api.desadumbayabulan.my.id/api/v1/admin/leader-greeting', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Gagal mengambil data sambutan');
      const data = await res.json();
      setFormData({
        name: data.name || '',
        content: data.content || '',
        photo: data.photo || ''
      });
      setPreviewUrl(data.photo || '');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const uploadData = new FormData();
    uploadData.append('name', formData.name);
    uploadData.append('content', formData.content);
    if (selectedFile) {
      uploadData.append('file_photo', selectedFile);
    } else {
      uploadData.append('photo', formData.photo);
    }

    try {
      const res = await fetch('https://api.desadumbayabulan.my.id/api/v1/admin/leader-greeting', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: uploadData
      });

      if (!res.ok) throw new Error('Gagal memperbarui sambutan');
      const data = await res.json();
      
      setFormData({
        name: data.data.name,
        content: data.data.content,
        photo: data.data.photo || ''
      });
      setPreviewUrl(data.data.photo || '');
      setSelectedFile(null);
      
      setMessage({ type: 'success', text: 'Sambutan Kepala Desa berhasil diperbarui!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-on-surface-variant animate-pulse">Memuat data sambutan...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30">
        <h1 className="text-2xl font-bold text-primary">Kelola Sambutan Kepala Desa</h1>
        <p className="text-sm text-on-surface-variant mt-1">Sesuaikan pesan sambutan dan foto Kepala Desa di halaman beranda utama.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium ${
          message.type === 'success' ? 'bg-primary-container text-on-primary-container' : 'bg-error-container text-on-error-container'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-outline-variant/30 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Photo Column */}
          <div className="flex flex-col items-center space-y-4">
            <label className="block text-sm font-semibold text-on-surface text-center">Foto Resmi Kepala Desa</label>
            
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary-container shadow-lg bg-surface-container flex items-center justify-center">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview Kades" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-outline text-6xl">person</span>
              )}
            </div>

            <input 
              type="file" 
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="px-4 py-2 border border-primary text-primary font-bold text-xs rounded-xl hover:bg-primary-container/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">upload</span>
                Pilih Foto
              </button>
              {previewUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl('');
                    setSelectedFile(null);
                    setFormData(prev => ({ ...prev, photo: '' }));
                  }}
                  className="px-3 py-2 border border-error text-error font-bold text-xs rounded-xl hover:bg-error-container/30 transition-all cursor-pointer"
                >
                  Hapus
                </button>
              )}
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">Nama Lengkap Kepala Desa *</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                placeholder="Contoh: Taslim, S.Pd"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">Pesan Sambutan *</label>
              <textarea 
                rows="6"
                required
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm leading-relaxed"
                placeholder="Masukkan pesan sambutan hangat untuk warga desa..."
              />
            </div>
          </div>

        </div>

        <div className="flex justify-end pt-4 border-t border-outline-variant/30">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl font-bold bg-primary text-white hover:bg-primary-container hover:text-on-primary-container transition-all cursor-pointer shadow-md text-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                Menyimpan...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">save</span>
                Simpan Perubahan
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
