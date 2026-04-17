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
            {/* Left side - Image */}
            <div className="flex justify-center">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aliaga_Nueva_Ecija-dieHQ6M42us6abrNxyS40PP1QYjKUX.png"
                alt="Municipality of Aliaga Official Seal"
                className="h-64 w-64 object-contain drop-shadow-lg"
              />
            </div>
            {/* Right side - Text */}
            <div>
              <h2 className="m-0 text-3xl font-black text-bayan-ink">Municipality Profile</h2>
              <p className="mt-4 text-lg text-bayan-muted leading-relaxed">
                The Municipality of Aliaga is one of the progressive municipalities in the province of Nueva Ecija, Philippines. With a land area of approximately 68 square kilometers and a population of 72,134 residents as of the latest census, Aliaga represents a vibrant and growing community.
              </p>
              <p className="mt-4 text-lg text-bayan-muted leading-relaxed">
                Our municipality is divided into 26 barangays, each with its own local government structure and community programs. Together, we work towards sustainable development, improved public services, and enhanced quality of life for all residents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="border-b border-bayan-border bg-bayan-surface px-4 py-16">
        <div className="mx-auto max-w-[1120px]">
          <h2 className="mb-12 text-center text-3xl font-black text-bayan-ink">Why Aliaga Matters</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {highlights.map((item, index) => (
              <div key={index} className="dashboard-section-card">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="m-0 font-black text-bayan-ink text-sm">{item.title}</h3>
                <p className="mt-2 m-0 text-sm text-bayan-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Geography & Barangays Section */}
      <section className="border-b border-bayan-border bg-white px-4 py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="grid gap-12 md:grid-cols-2 md:items-center mb-16">
            {/* Map */}
            <div className="flex justify-center">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aliaga_in_Nueva_Ecija.svg-JtCl0fL6Dik33A95YWmi64JM4k8ZZZ.png"
                alt="Map of Aliaga in Nueva Ecija showing barangay divisions and geographic location"
                className="max-w-full h-auto rounded-lg shadow-card"
              />
            </div>
            {/* Text */}
            <div>
              <h2 className="m-0 text-3xl font-black text-bayan-ink">Geographic Profile</h2>
              <p className="mt-4 text-lg text-bayan-muted leading-relaxed">
                Located in the heart of Nueva Ecija, Aliaga sits in the CALABARZON region of Central Luzon. The municipality covers approximately 90 square kilometers with elevation ranging from 19 to 43 meters above sea level.
              </p>
              <p className="mt-4 text-lg text-bayan-muted leading-relaxed">
                Positioned strategically between the Pampanga Grande and Pampanga Chico rivers, Aliaga occupies a large and fertile valley ideal for agriculture. The municipality's climate is relatively cool and healthful, supporting diverse agricultural production.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border-l-4 border-bayan-teal bg-bayan-teal-soft p-4">
                  <p className="m-0 text-xs text-bayan-muted-2 uppercase tracking-wide">Land Area</p>
                  <p className="m-0 mt-2 text-xl font-black text-bayan-ink">90.04 km²</p>
                </div>
                <div className="rounded-lg border-l-4 border-bayan-teal bg-bayan-teal-soft p-4">
                  <p className="m-0 text-xs text-bayan-muted-2 uppercase tracking-wide">Population Density</p>
                  <p className="m-0 mt-2 text-xl font-black text-bayan-ink">801/km²</p>
                </div>
              </div>
            </div>
          </div>

          {/* Barangays Grid */}
          <div>
            <div className="mb-10 text-center">
              <p className="eyebrow">ADMINISTRATIVE DIVISIONS</p>
              <h2 className="m-0 text-3xl font-black text-bayan-ink md:text-4xl">
                26 Barangays
              </h2>
              <p className="mt-2 text-lg text-bayan-muted">
                Each barangay has its own local government and community programs
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {barangays.map((barangay, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-bayan-border bg-bayan-surface p-4 text-center transition hover:border-bayan-teal hover:shadow-card"
                >
                  <span className="block text-xs font-bold text-bayan-teal uppercase">Barangay</span>
                  <h3 className="m-0 text-sm font-black text-bayan-ink mt-1">{barangay}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Culture & Traditions */}
      <section className="border-b border-bayan-border bg-white px-4 py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-12 text-center">
            <p className="eyebrow">RICH CULTURAL HERITAGE</p>
            <h2 className="m-0 text-3xl font-black text-bayan-ink md:text-4xl">
              Taong Putik Festival
            </h2>
            <p className="mt-2 text-lg text-bayan-muted">
              A unique celebration of faith, community, and tradition
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            {/* Image */}
            <div className="flex justify-center">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Taong_Putik_Festival-GWASdUcbwkdjlTLXp6vpvQ1zEKxZCK.jpg"
                alt="Taong Putik Festival - Devotees covered in mud celebrating Saint John the Baptist"
                className="w-full rounded-lg shadow-card"
              />
            </div>
            {/* Text */}
            <div>
              <h3 className="m-0 text-2xl font-black text-bayan-ink mb-4">A Living Tradition</h3>
              <p className="text-lg text-bayan-muted leading-relaxed mb-4">
                The Taong Putik Festival is an annual celebration held every June 24th on the feast day of Saint John the Baptist. This unique festival showcases the deep faith and vibrant culture of the Aliaga people.
              </p>
              <p className="text-lg text-bayan-muted leading-relaxed mb-4">
                Devotees cover themselves in mud and dried banana leaves, creating striking mud costumes and masks. They travel through the municipality visiting homes and asking for alms in the form of candles to offer to the saint.
              </p>
              <div className="rounded-lg border-l-4 border-bayan-teal bg-bayan-teal-soft p-4 mt-6">
                <p className="m-0 text-sm font-bold text-bayan-ink">Festival Highlights:</p>
                <ul className="mt-3 m-0 space-y-2 text-sm text-bayan-muted">
                  <li>Mud costume rituals and mud parades</li>
                  <li>House-to-house visits by devotees</li>
                  <li>Candle offerings and religious ceremonies</li>
                  <li>Community feasts and celebrations</li>
                  <li>Traditional performances and street festivals</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Government & Administration */}
      <section className="border-b border-bayan-border bg-bayan-surface px-4 py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            {/* Text */}
            <div>
              <h2 className="m-0 text-3xl font-black text-bayan-ink">Municipal Government</h2>
              <p className="mt-4 text-lg text-bayan-muted leading-relaxed">
                The Municipality of Aliaga is governed by the Sangguniang Bayan (Municipal Council) headed by the Mayor. The municipal government is committed to transparency, accountability, and efficient service delivery.
              </p>
              <p className="mt-4 text-lg text-bayan-muted leading-relaxed">
                The Municipal Hall serves as the administrative center where citizens can access various government services, file applications, and attend to municipal affairs.
              </p>
              <div className="mt-6 grid gap-3">
                <div className="rounded-lg border border-bayan-border bg-white p-4">
                  <p className="m-0 text-sm font-bold text-bayan-teal">Government Structure</p>
                  <p className="m-0 mt-2 text-sm text-bayan-muted">Sangguniang Bayan with 14 Barangay Councils</p>
                </div>
              </div>
            </div>
            {/* Image */}
            <div className="flex justify-center">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aliaga_Municipal_Hall-AbAmYpK1VmL7wSIf5E5wQNzIotFzdS.jpg"
                alt="Aliaga Municipal Hall - Administrative center and seat of local government"
                className="w-full rounded-lg shadow-card"
              />
            </div>
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
