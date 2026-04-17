import { Link } from "react-router-dom";
import HeroSection from "../../components/common/HeroSection.jsx";

export default function AboutPage() {
  const barangays = [
    "Barangay Aliaga",
    "Barangay Alcala",
    "Barangay Antipolo",
    "Barangay Apostol",
    "Barangay Burgos",
    "Barangay Calubang",
    "Barangay Dacanlao",
    "Barangay Kapataan",
    "Barangay Layugan",
    "Barangay Liberato",
    "Barangay Mang-Ali",
    "Barangay Putingkasama",
    "Barangay San Rafael",
    "Barangay Tagumpay",
  ];

  const highlights = [
    {
      title: "Strategic Location",
      description: "Centrally located in Nueva Ecija, providing easy access to regional centers and agricultural areas.",
      icon: "🗺️",
    },
    {
      title: "Agricultural Hub",
      description: "Known for productive farmlands and agricultural commerce, supporting local economy and food security.",
      icon: "🌾",
    },
    {
      title: "Community-Oriented",
      description: "Strong barangay system with active community organizations and grassroots engagement programs.",
      icon: "🤝",
    },
    {
      title: "Infrastructure Development",
      description: "Continuous investment in roads, facilities, and public services to improve quality of life.",
      icon: "🏗️",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroSection
        title="About Aliaga"
        subtitle="Discover our community's rich heritage, values, and commitment to progress"
      />

      {/* Main Content */}
      <section className="border-b border-bayan-border bg-white px-4 py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="m-0 text-3xl font-black text-bayan-ink">Municipality Profile</h2>
              <p className="mt-4 text-lg text-bayan-muted leading-relaxed">
                The Municipality of Aliaga is one of the progressive municipalities in the province of Nueva Ecija, Philippines. With a land area of approximately 68 square kilometers and a population of 72,134 residents as of the latest census, Aliaga represents a vibrant and growing community.
              </p>
              <p className="mt-4 text-lg text-bayan-muted leading-relaxed">
                Our municipality is divided into 14 barangays, each with its own local government structure and community programs. Together, we work towards sustainable development, improved public services, and enhanced quality of life for all residents.
              </p>
            </div>
            <div className="grid gap-4">
              {highlights.slice(0, 2).map((item, index) => (
                <div key={index} className="dashboard-section-card">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="m-0 font-black text-bayan-ink">{item.title}</h3>
                  <p className="mt-2 m-0 text-bayan-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Barangays Section */}
      <section className="border-b border-bayan-border bg-bayan-surface px-4 py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-10 text-center">
            <p className="eyebrow">ADMINISTRATIVE DIVISIONS</p>
            <h2 className="m-0 text-3xl font-black text-bayan-ink md:text-4xl">
              14 Barangays
            </h2>
            <p className="mt-2 text-lg text-bayan-muted">
              Each barangay has its own local government and community programs
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {barangays.map((barangay, index) => (
              <div
                key={index}
                className="rounded-lg border border-bayan-border bg-white p-4 text-center transition hover:border-bayan-teal hover:shadow-card"
              >
                <span className="block text-sm font-bold text-bayan-teal">{index + 1}</span>
                <h3 className="m-0 text-sm font-black text-bayan-ink">{barangay}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="border-b border-bayan-border bg-white px-4 py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-10 text-center">
            <p className="eyebrow">KEY CHARACTERISTICS</p>
            <h2 className="m-0 text-3xl font-black text-bayan-ink md:text-4xl">
              What Makes Aliaga Special
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {highlights.map((item, index) => (
              <div key={index} className="dashboard-section-card">
                <div className="mb-4 text-5xl">{item.icon}</div>
                <h3 className="m-0 text-lg font-black text-bayan-ink">{item.title}</h3>
                <p className="mt-2 m-0 text-bayan-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History & Vision */}
      <section className="border-b border-bayan-border bg-bayan-surface px-4 py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h3 className="m-0 text-2xl font-black text-bayan-ink mb-4">Our Mission</h3>
              <p className="text-lg text-bayan-muted leading-relaxed">
                To deliver efficient, transparent, and citizen-focused government services that promote sustainable development, improve quality of life, and foster community empowerment in Aliaga.
              </p>
            </div>
            <div>
              <h3 className="m-0 text-2xl font-black text-bayan-ink mb-4">Our Vision</h3>
              <p className="text-lg text-bayan-muted leading-relaxed">
                A progressive municipality where every resident enjoys quality services, economic opportunities, and a safe, sustainable environment for present and future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-bayan-navy to-bayan-navy-2 px-4 py-16 text-center text-white">
        <div className="mx-auto max-w-[600px]">
          <h2 className="m-0 text-3xl font-black md:text-4xl">
            Be Part of Aliaga
          </h2>
          <p className="mt-4 text-lg text-slate-200">
            Access our services, stay informed, and participate in community initiatives through our digital portal.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/citizen/login" className="button primary">
              Get Started
            </Link>
            <Link to="/" className="button ghost">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
