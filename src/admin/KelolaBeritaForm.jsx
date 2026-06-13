import { useState, useEffect, useRef } from 'react';

export default function KelolaBeritaForm({ token }) {
  const [beritas, setBeritas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Pemerintahan',
    author: '',
    image: '',
    excerpt: '',
    body: '' // Rich HTML string
  });

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const inlineImageInputRef = useRef(null);

  const categories = ['Pemerintahan', 'Wisata', 'Ekonomi', 'Pengumuman', 'Pembangunan', 'Kesehatan', 'Teknologi'];

  useEffect(() => {
    fetchBeritas();
  }, []);

  const fetchBeritas = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://api.desadumbayabulan.my.id/api/v1/admin/berita', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Gagal mengambil data berita');
      const data = await res.json();
      setBeritas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (berita = null) => {
    if (berita) {
      setEditingId(berita.id);
      setFormData({
        title: berita.title,
        category: berita.category,
        author: berita.author,
        image: berita.image || '',
        excerpt: berita.excerpt || '',
        body: berita.body || ''
      });
      // Delay to ensure ref exists
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = berita.body || '';
        }
      }, 50);
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        category: 'Pemerintahan',
        author: 'Admin Desa',
        image: '',
        excerpt: '',
        body: ''
      });
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
        }
      }, 50);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  // WYSIWYG commands
  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, body: editorRef.current.innerHTML }));
    }
  };

  // Upload headline image
  const handleHeadlineUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const res = await fetch('https://api.desadumbayabulan.my.id/api/v1/admin/berita/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: uploadData
      });
      if (!res.ok) throw new Error('Gagal mengunggah gambar');
      const data = await res.json();
      setFormData(prev => ({ ...prev, image: data.url }));
    } catch (err) {
      alert(err.message);
    }
  };

  // Upload inline body image
  const handleInlineImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const res = await fetch('https://api.desadumbayabulan.my.id/api/v1/admin/berita/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: uploadData
      });
      if (!res.ok) throw new Error('Gagal mengunggah gambar');
      const data = await res.json();

      editorRef.current.focus();
      
      // Build visual wrapper for the image
      const imageHtml = `<div class="my-4 text-center"><img src="${data.url}" class="rounded-xl max-w-full h-auto inline-block border border-outline-variant/30 shadow-md" alt="Gambar Berita" /><p class="text-xs text-on-surface-variant italic mt-1">Dokumentasi Desa</p></div>`;
      
      document.execCommand('insertHTML', false, imageHtml);
      setFormData(prev => ({ ...prev, body: editorRef.current.innerHTML }));
    } catch (err) {
      alert(err.message);
    } finally {
      // Clear file input value to allow uploading same file again
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Ensure body matches content from editor div
    const submitData = { 
      ...formData, 
      body: editorRef.current ? editorRef.current.innerHTML : formData.body 
    };

    try {
      const url = editingId 
        ? `https://api.desadumbayabulan.my.id/api/v1/admin/berita/${editingId}`
        : 'https://api.desadumbayabulan.my.id/api/v1/admin/berita';
      
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });
      
      if (!res.ok) throw new Error('Gagal menyimpan berita');
      
      await fetchBeritas();
      handleCloseModal();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus berita ini?')) return;
    
    try {
      const res = await fetch(`https://api.desadumbayabulan.my.id/api/v1/admin/berita/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Gagal menghapus berita');
      fetchBeritas();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredBeritas = beritas.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="p-8 text-center text-on-surface-variant animate-pulse">Memuat data berita...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30">
        <div>
          <h1 className="text-2xl font-bold text-primary">Manajemen Berita</h1>
          <p className="text-sm text-on-surface-variant mt-1">Kelola publikasi dan pengumuman desa.</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="Cari berita..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-sm"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex-shrink-0 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-colors font-semibold text-sm cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Tambah Berita
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-container-light text-on-surface-variant">
              <tr>
                <th className="px-6 py-4 font-semibold">Judul & Kategori</th>
                <th className="px-6 py-4 font-semibold">Penulis</th>
                <th className="px-6 py-4 font-semibold">Tanggal & Views</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredBeritas.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-on-surface-variant">
                    Tidak ada berita ditemukan.
                  </td>
                </tr>
              ) : (
                filteredBeritas.map(item => (
                  <tr key={item.id} className="hover:bg-surface-container-light/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center overflow-hidden flex-shrink-0 border border-outline-variant/20">
                          {item.image ? (
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-outline">newspaper</span>
                          )}
                        </div>
                        <div className="max-w-[200px] md:max-w-xs overflow-hidden">
                          <p className="font-bold text-on-surface truncate" title={item.title}>{item.title}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-primary-container text-on-primary-container text-[10px] font-bold uppercase rounded-md">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-[10px] font-bold">
                          {item.initials}
                        </div>
                        <span className="font-medium text-on-surface-variant">{item.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant text-xs space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-[14px]">visibility</span>
                        {item.views} Views
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary-container transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-error hover:bg-error-container hover:text-on-error-container transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-light">
              <h2 className="text-xl font-bold text-primary">
                {editingId ? 'Edit Berita' : 'Tulis Berita Baru'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 hover:bg-black/5 rounded-full transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-surface space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface mb-1">Judul Berita *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                      placeholder="Masukkan judul..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-on-surface mb-1">Kategori *</label>
                      <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm cursor-pointer bg-white"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-on-surface mb-1">Penulis *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.author}
                        onChange={e => setFormData({...formData, author: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                        placeholder="Contoh: Admin Desa"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface mb-1">Headline Gambar (Upload)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleHeadlineUpload}
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-primary text-primary font-bold text-xs hover:bg-primary-container/30 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">upload</span>
                        Pilih Gambar Headline
                      </button>
                      {formData.image && (
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, image: ''})}
                          className="px-3 py-2 rounded-xl border border-error text-error font-bold text-xs hover:bg-error-container/30 transition-all cursor-pointer"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                  {formData.image && (
                    <div className="w-full h-24 rounded-lg overflow-hidden border border-outline-variant/30 shadow-inner">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1">Ringkasan (Excerpt)</label>
                <textarea 
                  rows="2"
                  value={formData.excerpt}
                  onChange={e => setFormData({...formData, excerpt: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm resize-none"
                  placeholder="Ringkasan singkat yang muncul di kartu berita..."
                />
              </div>

              {/* WYSIWYG Editor */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface">Isi Berita (Editor Teks Kaya)</label>
                
                {/* Editor Toolbar */}
                <div className="bg-surface-container-light border border-outline-variant rounded-t-xl p-2 flex flex-wrap gap-1.5 items-center">
                  
                  {/* Text Style Controls */}
                  <button
                    type="button"
                    onClick={() => executeCommand('bold')}
                    className="p-1.5 rounded hover:bg-black/5 font-bold text-sm min-w-[28px] h-[28px] flex items-center justify-center cursor-pointer"
                    title="Tebal"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('italic')}
                    className="p-1.5 rounded hover:bg-black/5 italic text-sm min-w-[28px] h-[28px] flex items-center justify-center cursor-pointer"
                    title="Miring"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('underline')}
                    className="p-1.5 rounded hover:bg-black/5 underline text-sm min-w-[28px] h-[28px] flex items-center justify-center cursor-pointer"
                    title="Garis Bawah"
                  >
                    U
                  </button>
                  <div className="h-5 w-[1px] bg-outline-variant/60 mx-1"></div>

                  {/* Header Formats */}
                  <button
                    type="button"
                    onClick={() => executeCommand('formatBlock', '<h2>')}
                    className="p-1.5 rounded hover:bg-black/5 text-xs font-bold min-w-[28px] h-[28px] flex items-center justify-center cursor-pointer"
                    title="Subjudul H2"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('formatBlock', '<h3>')}
                    className="p-1.5 rounded hover:bg-black/5 text-xs font-bold min-w-[28px] h-[28px] flex items-center justify-center cursor-pointer"
                    title="Subjudul H3"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('formatBlock', '<p>')}
                    className="p-1.5 rounded hover:bg-black/5 text-xs font-bold min-w-[28px] h-[28px] flex items-center justify-center cursor-pointer"
                    title="Paragraf Normal"
                  >
                    Paragraf
                  </button>
                  <div className="h-5 w-[1px] bg-outline-variant/60 mx-1"></div>

                  {/* Lists */}
                  <button
                    type="button"
                    onClick={() => executeCommand('insertUnorderedList')}
                    className="p-1.5 rounded hover:bg-black/5 flex items-center justify-center cursor-pointer"
                    title="Daftar Simbol"
                  >
                    <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('insertOrderedList')}
                    className="p-1.5 rounded hover:bg-black/5 flex items-center justify-center cursor-pointer"
                    title="Daftar Angka"
                  >
                    <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
                  </button>
                  <div className="h-5 w-[1px] bg-outline-variant/60 mx-1"></div>

                  {/* Clear Format */}
                  <button
                    type="button"
                    onClick={() => executeCommand('removeFormat')}
                    className="p-1.5 rounded hover:bg-black/5 flex items-center justify-center cursor-pointer"
                    title="Hapus Format Teks"
                  >
                    <span className="material-symbols-outlined text-[18px]">format_clear</span>
                  </button>
                  <div className="h-5 w-[1px] bg-outline-variant/60 mx-1"></div>

                  {/* Inline Image Upload */}
                  <input 
                    type="file" 
                    accept="image/*"
                    ref={inlineImageInputRef}
                    onChange={handleInlineImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => inlineImageInputRef.current.click()}
                    className="p-1.5 rounded hover:bg-black/5 flex items-center justify-center gap-1 text-xs font-semibold text-primary cursor-pointer"
                    title="Sisipkan Gambar"
                  >
                    <span className="material-symbols-outlined text-[18px]">image</span>
                    <span>Sisipkan Gambar</span>
                  </button>
                </div>

                {/* Editor Editable Area */}
                <div 
                  ref={editorRef}
                  contentEditable
                  className="w-full min-h-[300px] max-h-[500px] overflow-y-auto px-4 py-3 rounded-b-xl border-x border-b border-outline-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm bg-white leading-relaxed text-on-surface"
                  placeholder="Tulis artikel berita di sini..."
                  onBlur={() => {
                    if (editorRef.current) {
                      setFormData(prev => ({ ...prev, body: editorRef.current.innerHTML }));
                    }
                  }}
                  onInput={() => {
                    if (editorRef.current) {
                      setFormData(prev => ({ ...prev, body: editorRef.current.innerHTML }));
                    }
                  }}
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-outline-variant/30 bg-surface-container-light flex justify-end gap-3">
              <button 
                type="button"
                onClick={handleCloseModal}
                className="px-5 py-2.5 rounded-xl font-bold text-on-surface-variant hover:bg-black/5 transition-colors cursor-pointer text-sm"
              >
                Batal
              </button>
              <button 
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.title || !formData.author}
                className="px-5 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-container hover:text-on-primary-container transition-all cursor-pointer text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    Simpan Berita
                  </>
                )}
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
