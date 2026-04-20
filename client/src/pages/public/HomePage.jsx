import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api")
  .trim()
  .replace(/\/$/, "");

const SERVICES = [
  { icon: "📄", title: "Document Requests", description: "Request official documents and certificates online without an office visit.", link: "/citizen/login" },
  { icon: "📅", title: "Appointments", description: "Book service appointments at your convenience and skip the queue.", link: "/citizen/login" },
  { icon: "⚠️", title: "Report Issues", description: "Submit complaints and community reports directly to local authorities.", link: "/citizen/login" },
  { icon: "📍", title: "Track Requests", description: "Monitor the real-time status of your submitted requests anytime.", link: "/citizen/login" },
];

const PORTALS = [
  { label: "Citizen Services", to: "/citizen/login", cls: "button primary" },
  { label: "Barangay Admin", to: "/barangay/login", cls: "button ghost" },
  { label: "System Admin", to: "/super-admin/login", cls: "button ghost" },
];

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, nRes] = await Promise.allSettled([
          fetch(`${API_BASE}/public/municipality/stats`),
          fetch(`${API_BASE}/public/news?featured=true&limit=3`),
        ]);
        if (sRes.status === "fulfilled" && sRes.value.ok) {
          const d = await sRes.value.json();
          setStats(d.data);
        }
        if (nRes.status === "fulfilled" && nRes.value.ok) {
          const d = await nRes.value.json();
          setNews(d.data || []);
        }
      } catch (err) {
        console.error("HomePage fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const displayStats = stats || { population: 72134, barangays: 26, servicesAvailable: 50, activeUsers: 8500 };

  return (
    <div className="min-h-screen">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/aliaga-hall.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-green-700/70" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 py-16 text-center text-white">
          <img src="https://upload.wikimedia.org/wikipedia/en/4/42/Aliaga_Nueva_Ecija.png" alt="Aliaga Municipal Logo" className="mx-auto mb-8 w-20" />

          <p className="eyebrow mb-4 text-bayan-yellow">Official Digital Platform</p>
          <h1 className="mb-4 text-5xl font-light leading-tight tracking-tight md:text-7xl">BayanLink</h1>
          <h2 className="mb-6 text-2xl font-light text-slate-200 md:text-3xl">Municipality of Aliaga</h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-light leading-relaxed text-slate-300">
            Your gateway to seamless municipal services and citizen engagement.
          </p>

          {/* Portal Access */}
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
            <p className="mb-5 text-sm font-bold uppercase tracking-widest text-slate-200">Portal Access</p>
            <div className="flex flex-wrap justify-center gap-3">
              {PORTALS.map((p) => (
                <Link key={p.to} to={p.to} className={p.cls}>
                  {p.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/about" className="text-slate-300 transition hover:text-white">About Aliaga →</Link>
            <Link to="/services" className="text-slate-300 transition hover:text-white">Our Services →</Link>
            <Link to="/news" className="text-slate-300 transition hover:text-white">Latest News →</Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/60">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────────────────────────── */}
      <section className="border-b border-bayan-border bg-white">
        <div className="mx-auto max-w-[1120px] px-4 py-12">
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {[
              { emoji: "👥", label: "Population", value: displayStats.population?.toLocaleString() },
              { emoji: "🗺️", label: "Barangays", value: displayStats.barangays },
              { emoji: "✓", label: "Services", value: `${displayStats.servicesAvailable}+` },
              { emoji: "👤", label: "Active Users", value: `${displayStats.activeUsers?.toLocaleString()}+` },
            ].map((s) => (
              <div key={s.label} className="dashboard-mini-stat">
                <div className="dashboard-mini-stat-icon text-2xl">{s.emoji}</div>
                <small>{s.label}</small>
                <strong>{s.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Services ─────────────────────────────────────────────────── */}
      <section className="border-b border-bayan-border bg-bayan-surface px-4 py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-12 text-center">
            <p className="eyebrow">OUR SERVICES</p>
            <h2 className="m-0 text-3xl font-black text-bayan-ink md:text-4xl">What We Offer</h2>
            <p className="mt-2 text-lg text-bayan-muted">Access essential municipal services through our digital portal</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {SERVICES.map((s) => (
              <Link key={s.title} to={s.link} className="quick-action-card">
                <div className="quick-action-icon text-2xl">{s.icon}</div>
                <div className="min-w-0 flex-1">
                  <strong>{s.title}</strong>
                  <p>{s.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── News ─────────────────────────────────────────────────────── */}
      <section className="border-b border-bayan-border bg-white px-4 py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-12 text-center">
            <p className="eyebrow">LATEST UPDATES</p>
            <h2 className="m-0 text-3xl font-black text-bayan-ink md:text-4xl">News & Announcements</h2>
            <p className="mt-2 text-lg text-bayan-muted">Stay informed with the latest municipal news and updates</p>
          </div>

          {loading ? (
            <p className="py-12 text-center text-bayan-muted">Loading news...</p>
          ) : news.length > 0 ? (
            <>
              <div className="grid gap-5 md:grid-cols-3">
                {news.map((article) => (
                  <Link
                    key={article._id}
                    to="/news"
                    className="dashboard-section-card transition duration-200 hover:border-bayan-teal hover:shadow-lg"
                  >
                    {article.imageUrl ? (
                      <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                        <img alt={article.title} className="h-full w-full object-cover" src={article.imageUrl} />
                      </div>
                    ) : (
                      <div className="mb-4 flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-bayan-navy/10 to-bayan-teal/10 text-4xl">
                        {article.category === "Emergency" ? "🚨" : article.category === "Health" ? "❤️" : article.category === "Events" ? "🎉" : "📋"}
                      </div>
                    )}
                    <span className="mb-3 inline-block rounded-full bg-bayan-teal-soft px-2.5 py-1 text-xs font-bold text-bayan-teal">
                      {article.category || "General"}
                    </span>
                    <h3 className="m-0 mb-2 text-lg font-black text-bayan-ink">{article.title}</h3>
                    <p className="m-0 mb-4 text-sm text-bayan-muted">
                      {article.summary || article.content?.substring(0, 100) || "Click to read more..."}
                    </p>
                    <p className="m-0 text-xs text-bayan-muted-2">
                      {article.publishedAt && new Date(article.publishedAt).toLocaleDateString("en-PH", { dateStyle: "medium" })}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link to="/news" className="button ghost">View All News</Link>
              </div>
            </>
          ) : (
            <div className="empty-state py-12">
              <div className="empty-state-icon text-2xl">📰</div>
              <h2>No announcements yet</h2>
              <p>Check back soon for the latest news and updates from Aliaga.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-bayan-navy to-bayan-navy-2 px-4 py-16 text-center text-white">
        <div className="mx-auto max-w-[600px]">
          <h2 className="m-0 text-3xl font-black md:text-4xl">Ready to Access Municipal Services?</h2>
          <p className="mt-4 text-lg text-slate-200">
            Create an account or sign in to start managing your municipal requests today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/signup" className="button primary">Create Account</Link>
            <Link to="/citizen/login" className="button ghost">Citizen Login</Link>
          </div>
        </div>
      </section>

      {/* ─── About Preview ────────────────────────────────────────────── */}
      <section className="border-b border-bayan-border bg-bayan-surface px-4 py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="eyebrow">ABOUT ALIAGA</p>
              <h2 className="m-0 text-3xl font-black text-bayan-ink md:text-4xl">Municipality of Aliaga, Nueva Ecija</h2>
              <p className="mt-4 text-lg leading-relaxed text-bayan-muted">
                Aliaga is a progressive municipality in Nueva Ecija, Philippines, with a population of 72,134 residents spread across 26 barangays.
              </p>
              <div className="mt-6 grid gap-3">
                {[
                  { emoji: "🏛️", title: "Democratic Governance", desc: "Transparent and citizen-focused administration" },
                  { emoji: "🌱", title: "Sustainable Development", desc: "Committed to environmental protection and growth" },
                  { emoji: "🤝", title: "Community Empowerment", desc: "Supporting local businesses and residents" },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <span className="text-xl">{item.emoji}</span>
                    <div>
                      <strong className="block text-bayan-ink">{item.title}</strong>
                      <p className="m-0 text-sm text-bayan-muted">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/about" className="mt-8 inline-flex button primary">Learn More About Aliaga</Link>
            </div>
            <div className="flex items-center justify-center rounded-lg aspect-video bg-gradient-to-br from-bayan-navy/10 to-bayan-teal/10">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aliaga_Nueva_Ecija-dieHQ6M42us6abrNxyS40PP1QYjKUX.png"
                alt="Aliaga Municipal Seal"
                className="h-36 w-36 opacity-80"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
