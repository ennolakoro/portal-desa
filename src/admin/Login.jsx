import { useState } from 'react';

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.desadumbayabulan.my.id/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
      } else {
        setError(data.message || 'Login gagal');
      }
    } catch (err) {
      setError('Koneksi ke server gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-outline-variant">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-fixed rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-3xl font-bold">admin_panel_settings</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Admin Portal</h1>
          <p className="text-on-surface-variant text-sm">Masuk untuk mengelola Desa Dumbaya Bulan</p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-4 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="admin@desadumbayabulan.id"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-container text-on-primary py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading ? 'Memproses...' : (
              <>
                <span className="material-symbols-outlined text-xl">login</span>
                Masuk
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
