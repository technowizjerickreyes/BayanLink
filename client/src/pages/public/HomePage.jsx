import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../../components/common/HeroSection.jsx";

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch municipality stats
        const statsRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/public/municipality/stats`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.data);
        }

        // Fetch featured news
        const newsRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/public/news?featured=true&limit=3`);
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          setNews(newsData.data || []);
        }
      } catch (error) {
        console.error("Error fetching public data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayStats = stats || {
    population: 72134,
    barangays: 14,
    servicesAvailable: 50,
    activeUsers: 8500,
  };

  const services = [
    {
      icon: "file",
      title: "Document Requests",
      description: "Request official documents and certificates from the municipality quickly and easily.",
      link: "/citizen/login",
    },
    {
      icon: "calendar",
      title: "Appointments",
      description: "Book appointments with municipal or barangay offices at your convenience.",
      link: "/citizen/login",
    },
    {
      icon: "alert",
      title: "Report Issues",
      description: "Submit complaints and community reports directly to local authorities.",
      link: "/citizen/login",
    },
    {
      icon: "tracking",
      title: "Track Requests",
      description: "Monitor the status of your submitted requests in real-time.",
      link: "/citizen/login",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Welcome to Aliaga Municipal Portal"
        subtitle="Your gateway to seamless access to municipal services. Submit requests, book appointments, and track your documents online."
      >
        <div className="flex flex-wrap gap-3">
          <Link to="/citizen/login" className="button primary">
            Get Started
          </Link>
          <Link to="/about" className="button ghost">
            Learn More
          </Link>
        </div>
      </HeroSection>

      {/* Quick Stats */}
      <section className="border-b border-bayan-border bg-white">
        <div className="mx-auto max-w-[1120px] px-4 py-12">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            <div className="dashboard-mini-stat">
              <div className="dashboard-mini-stat-icon">👥</div>
              <span>Population</span>
              <strong>{displayStats.population?.toLocaleString()}</strong>
            </div>
            <div className="dashboard-mini-stat">
              <div className="dashboard-mini-stat-icon">🗺️</div>
              <span>Barangays</span>
              <strong>{displayStats.barangays}</strong>
            </div>
            <div className="dashboard-mini-stat">
              <div className="dashboard-mini-stat-icon">✓</div>
              <span>Services</span>
              <strong>{displayStats.servicesAvailable}+</strong>
            </div>
            <div className="dashboard-mini-stat">
              <div className="dashboard-mini-stat-icon">👤</div>
              <span>Active Users</span>
              <strong>{displayStats.activeUsers?.toLocaleString()}+</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="border-b border-bayan-border bg-bayan-surface px-4 py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-12 text-center">
            <p className="eyebrow">OUR SERVICES</p>
            <h2 className="m-0 text-3xl font-black text-bayan-ink md:text-4xl">
              What We Offer
            </h2>
            <p className="mt-2 text-lg text-bayan-muted">
              Access essential municipal services through our digital portal
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className="quick-action-card transition duration-200 hover:shadow-lg"
              >
                <div className="quick-action-icon">
                  {service.icon === "file" && "📄"}
                  {service.icon === "calendar" && "📅"}
                  {service.icon === "alert" && "⚠️"}
                  {service.icon === "tracking" && "📍"}
                </div>
                <div className="min-w-0 flex-1">
                  <strong>{service.title}</strong>
                  <p>{service.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured News Section */}
      <section className="border-b border-bayan-border bg-white px-4 py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-12 text-center">
            <p className="eyebrow">LATEST UPDATES</p>
            <h2 className="m-0 text-3xl font-black text-bayan-ink md:text-4xl">
              News & Announcements
            </h2>
            <p className="mt-2 text-lg text-bayan-muted">
              Stay informed with the latest municipal news and updates
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-bayan-muted">Loading news...</p>
            </div>
          ) : news.length > 0 ? (
            <>
              <div className="grid gap-5 md:grid-cols-3">
                {news.map((article) => (
                  <Link
                    key={article._id}
                    to="/news"
                    className="dashboard-section-card transition duration-200 hover:shadow-lg hover:border-bayan-teal"
                  >
                    {article.imageUrl ? (
                      <div className="mb-4 aspect-video overflow-hidden rounded">
                        <img 
                          alt={article.title} 
                          className="h-full w-full object-cover" 
                          src={article.imageUrl} 
                        />
                      </div>
                    ) : (
                      <div className="mb-4 aspect-video rounded bg-gradient-to-br from-bayan-navy/20 to-bayan-teal/20 flex items-center justify-center text-4xl">
                        {article.category === "Emergency" ? "🚨" : 
                         article.category === "Health" ? "❤️" : 
                         article.category === "Events" ? "🎉" : "📋"}
                      </div>
                    )}
                    <span className="inline-block rounded-full bg-bayan-teal-soft px-2.5 py-1 text-xs font-bold text-bayan-teal mb-3">
                      {article.category}
                    </span>
                    <h3 className="m-0 font-black text-lg text-bayan-ink mb-2">
                      {article.title}
                    </h3>
                    <p className="m-0 text-sm text-bayan-muted mb-4">
                      {article.summary || article.content?.substring(0, 80) || "Click to read more..."}
                    </p>
                    <p className="m-0 text-xs text-bayan-muted-2">
                      {article.publishedAt && new Date(article.publishedAt).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link to="/news" className="button ghost">
                  View All News
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-bayan-muted">No articles available</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-bayan-navy to-bayan-navy-2 px-4 py-16 text-center text-white">
        <div className="mx-auto max-w-[600px]">
          <h2 className="m-0 text-3xl font-black md:text-4xl">
            Ready to Access Municipal Services?
          </h2>
          <p className="mt-4 text-lg text-slate-200">
            Create an account or log in to start managing your municipal requests today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/citizen/login" className="button primary">
              Citizen Login
            </Link>
            <Link to="/super-admin/login" className="button ghost">
              Admin Access
            </Link>
          </div>
        </div>
      </section>

      {/* About Section Preview */}
      <section className="border-b border-bayan-border bg-bayan-surface px-4 py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="eyebrow">ABOUT ALIAGA</p>
              <h2 className="m-0 text-3xl font-black text-bayan-ink md:text-4xl">
                Municipality of Aliaga, Nueva Ecija
              </h2>
              <p className="mt-4 text-lg text-bayan-muted leading-relaxed">
                Aliaga is a progressive municipality in Nueva Ecija, Philippines, with a population of 72,134 residents spread across 14 barangays. Our community is committed to delivering high-quality municipal services and fostering sustainable development.
              </p>
              <div className="mt-6 grid gap-3">
                <div className="flex gap-3">
                  <span className="text-xl">🏛️</span>
                  <div>
                    <strong className="block text-bayan-ink">Democratic Governance</strong>
                    <p className="m-0 text-sm text-bayan-muted">Transparent and citizen-focused administration</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-xl">🌱</span>
                  <div>
                    <strong className="block text-bayan-ink">Sustainable Development</strong>
                    <p className="m-0 text-sm text-bayan-muted">Committed to environmental protection and growth</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-xl">🤝</span>
                  <div>
                    <strong className="block text-bayan-ink">Community Empowerment</strong>
                    <p className="m-0 text-sm text-bayan-muted">Supporting local businesses and residents</p>
                  </div>
                </div>
              </div>
              <Link to="/about" className="mt-8 button primary inline-flex">
                Learn More About Aliaga
              </Link>
            </div>
            <div className="aspect-video rounded-lg bg-gradient-to-br from-bayan-navy/20 to-bayan-teal/20 flex items-center justify-center">
              <div className="text-6xl">🏢</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
