import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function StatsFloating() {
  const [stats, setStats] = useState({ adoptedCount: 0, reunitedCount: 0 });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/mascotas/stats`);
        const data = await res.json().catch(() => ({}));
        if (res.ok && data) {
          setStats({
            adoptedCount: Number(data.adoptedCount || 0),
            reunitedCount: Number(data.reunitedCount || 0),
          });
        }
      } catch (e) {
        // silencioso en portada
      }
    })();
  }, []);

  return (
    <div className="fixed right-4 top-24 z-40">
      <div className="bg-white/85 backdrop-blur-md shadow-xl rounded-2xl px-4 py-3 mb-3 border border-green-100">
        <div className="text-xs uppercase tracking-wide text-green-800/80">Hogares encontrados</div>
        <div className="text-2xl font-extrabold text-green-700">{stats.adoptedCount}</div>
        <div className="text-[13px] text-green-900/80">familias adoptaron</div>
      </div>
      <div className="bg-white/85 backdrop-blur-md shadow-xl rounded-2xl px-4 py-3 border border-amber-100">
        <div className="text-xs uppercase tracking-wide text-amber-700/80">Reencuentros</div>
        <div className="text-2xl font-extrabold text-amber-600">{stats.reunitedCount}</div>
        <div className="text-[13px] text-amber-900/80">volvieron con su familia</div>
      </div>
    </div>
  );
}
