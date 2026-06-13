import { useState, useEffect } from 'react';

export default function KelolaPotensiForm({ token }) {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    type: 'potensi',
    title: '',
    description: '',
    icon: 'star',
    image_url: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('https://api.desadumbayabulan.my.id/api/v1/admin/potensi-wisata', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Gagal mengambil data potensi & wisata', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      icon: item.icon || 'star',
      image_url: item.image_url || ''
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data potensi/wisata ini?')) return;
    try {
      const res = await fetch(`https://api.desadumbayabulan.my.id/api/v1/admin/potensi-wisata/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setMessage('success:Berhasil menghapus potensi/wisata!');
        fetchItems();
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Gagal menghapus');
      }
    } catch (err) {
      setMessage(`error:${err.message}`);
    }
  };

  const handleCancel = () => {
    setFormData({
      id: null,
      type: 'potensi',
      title: '',
      description: '',
      icon: 'star',
      image_url: ''
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    const url = isEditing
      ? `https://api.desadumbayabulan.my.id/api/v1/admin/potensi-wisata/${formData.id}`
      : 'https://api.desadumbayabulan.my.id/api/v1/admin/potensi-wisata';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const payload = {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        icon: formData.type === 'potensi' ? formData.icon : null,
        image_url: formData.type === 'wisata' ? formData.image_url : null
      };

      const res = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Gagal menyimpan data');
      setMessage(`success:Berhasil ${isEditing ? 'memperbarui' : 'menambahkan'} potensi/wisata!`);
      handleCancel();
      fetchItems();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`error:${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-primary tracking-tight">KELOLA POTENSI & WISATA DESA</h2>
          <p className="text-xs text-on-surface-variant font-medium">Atur data potensi ekonomi dan tujuan wisata di beranda utama</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${
          message.startsWith('success') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <span className="material-symbols-outlined">
            {message.startsWith('success') ? 'check_circle' : 'error'}
          </span>
          <span>{message.split(':')[1]}</span>
        </div>
      )}

      {/* Entry Form */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-6 lg:p-8">
        <h3 className="font-extrabold text-lg text-primary mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined">{isEditing ? 'edit_note' : 'add_circle'}</span>
          {isEditing ? 'Edit Potensi / Wisata' : 'Tambah Potensi / Wisata'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-outline uppercase tracking-wider block">Tipe Konten</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={isEditing}
                className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-semibold cursor-pointer"
              >
                <option value="potensi">Potensi Ekonomi Desa</option>
                <option value="wisata">Destinasi Wisata</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-outline uppercase tracking-wider block">Judul / Nama</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder={formData.type === 'potensi' ? 'Contoh: Sektor Perikanan' : 'Contoh: Pantai Indah'}
                className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-semibold"
              />
            </div>

            {formData.type === 'potensi' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-outline uppercase tracking-wider block">Nama Icon Material</label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="Contoh: sailing, agriculture, explore, forest"
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-semibold"
                />
                <span className="text-[10px] text-on-surface-variant block mt-1">
                  Gunakan nama icon dari Google Material Symbols (misal: sailing, agriculture, local_mall)
                </span>
              </div>
            )}

            {formData.type === 'wisata' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-outline uppercase tracking-wider block">URL Gambar Wisata</label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: https://unsplash.com/pantai.jpg"
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-semibold"
                />
              </div>
            )}

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-outline uppercase tracking-wider block">Deskripsi Singkat</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Tuliskan keterangan detail di sini..."
                className="w-full p-4 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-semibold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 h-12 border border-outline-variant hover:bg-surface-container-low text-on-surface font-semibold rounded-xl text-sm transition-all cursor-pointer"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 h-12 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-55"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-b-transparent"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">save</span>
                  {isEditing ? 'Simpan Edit' : 'Simpan Baru'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Listed Items Grid */}
      <div className="space-y-4">
        <h4 className="font-extrabold text-lg text-primary">Daftar Potensi & Destinasi Terdaftar</h4>
        
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-outline-variant/20 shadow-sm text-outline font-semibold italic">
            Belum ada potensi atau destinasi yang ditambahkan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 gap-4"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      item.type === 'potensi' 
                        ? 'bg-teal-50 text-teal-700 border border-teal-200' 
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}>
                      {item.type === 'potensi' ? 'Potensi' : 'Wisata'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="w-8 h-8 rounded-lg text-outline hover:text-primary hover:bg-primary-container/10 flex items-center justify-center transition-colors cursor-pointer"
                        title="Edit Item"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="w-8 h-8 rounded-lg text-outline hover:text-error hover:bg-error/10 flex items-center justify-center transition-colors cursor-pointer"
                        title="Hapus Item"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    {item.type === 'potensi' ? (
                      <div className="bg-teal-50 w-8 h-8 rounded-lg flex items-center justify-center text-teal-600 font-bold shrink-0">
                        <span className="material-symbols-outlined text-lg">{item.icon || 'star'}</span>
                      </div>
                    ) : (
                      <img 
                        src={item.image_url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"} 
                        alt={item.title}
                        className="w-8 h-8 rounded-lg object-cover shrink-0 border border-indigo-200"
                      />
                    )}
                    <h5 className="font-extrabold text-sm text-primary tracking-tight">{item.title}</h5>
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
