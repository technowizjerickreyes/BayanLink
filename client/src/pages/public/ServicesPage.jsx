import { Link } from "react-router-dom";
import HeroSection from "../../components/common/HeroSection.jsx";

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      title: "Document Requests",
      description: "Request and obtain official documents and certificates from the municipality",
      icon: "📄",
      features: [
        "Birth certificates",
        "Marriage certificates",
        "Barangay clearance",
        "Residence certificate",
        "Fast-track processing",
        "Online application",
      ],
      link: "/citizen/login",
    },
    {
      id: 2,
      title: "Appointments",
      description: "Schedule appointments with municipal or barangay offices",
      icon: "📅",
      features: [
        "Flexible scheduling",
        "Available time slots",
        "Automatic reminders",
        "Online booking",
        "No travel needed",
        "Real-time confirmation",
      ],
      link: "/citizen/login",
    },
    {
      id: 3,
      title: "Complaint & Feedback",
      description: "Submit complaints and community reports to local authorities",
      icon: "⚠️",
      features: [
        "Anonymous reporting",
        "Track complaint status",
        "Direct escalation",
        "Follow-up support",
        "Response guarantee",
        "Community involvement",
      ],
      link: "/citizen/login",
    },
    {
      id: 4,
      title: "Request Tracking",
      description: "Monitor the status of your submitted requests in real-time",
      icon: "📍",
      features: [
        "Real-time updates",
        "Status notifications",
        "Estimated completion",
        "Activity history",
        "Document preview",
        "Progress tracking",
      ],
      link: "/citizen/login",
    },
    {
      id: 5,
      title: "News & Announcements",
      description: "Stay informed with official municipal news and updates",
      icon: "📰",
      features: [
        "Latest announcements",
        "Official statements",
        "Community events",
        "Service updates",
        "Email notifications",
        "Category filters",
      ],
      link: "/news",
    },
    {
      id: 6,
      title: "Municipal Information",
      description: "Access information about municipal services and programs",
      icon: "ℹ️",
      features: [
        "Service directory",
        "Contact information",
        "Operating hours",
        "Office locations",
        "FAQ section",
        "Resource guides",
      ],
      link: "/about",
    },
  ];

  const process = [
    {
      step: "1",
      title: "Create Account",
      description: "Sign up with your email and basic information",
    },
    {
      step: "2",
      title: "Browse Services",
      description: "Explore available municipal services and options",
    },
    {
      step: "3",
      title: "Submit Request",
      description: "Fill out the form and submit your request online",
    },
    {
      step: "4",
      title: "Track & Receive",
      description: "Monitor progress and receive updates via email",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroSection
        title="Our Services"
        subtitle="Discover the range of municipal services available through our digital portal"
      />

      {/* How It Works */}
      <section className="border-b border-bayan-border bg-bayan-surface px-4 py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-10 text-center">
            <p className="eyebrow">GETTING STARTED</p>
            <h2 className="m-0 text-3xl font-black text-bayan-ink md:text-4xl">
              How It Works
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {process.map((item, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < process.length - 1 && (
                  <div className="absolute left-0 right-0 top-12 -mx-4 h-px bg-bayan-border hidden md:block"></div>
                )}

                {/* Content */}
                <div className="relative z-10 rounded-lg bg-white border border-bayan-border p-6 text-center">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-bayan-teal text-white font-black">
                    {item.step}
                  </div>
                  <h3 className="m-0 font-black text-bayan-ink">{item.title}</h3>
                  <p className="mt-2 m-0 text-sm text-bayan-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-10 text-center">
            <p className="eyebrow">AVAILABLE SERVICES</p>
            <h2 className="m-0 text-3xl font-black text-bayan-ink md:text-4xl">
              What We Offer
            </h2>
            <p className="mt-2 text-lg text-bayan-muted">
              Comprehensive municipal services tailored for your needs
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.id}
                to={service.link}
                className="dashboard-section-card group overflow-hidden transition hover:shadow-lg hover:border-bayan-teal"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="m-0 text-lg font-black text-bayan-ink mb-2">
                  {service.title}
                </h3>
                <p className="m-0 text-bayan-muted mb-4">{service.description}</p>

                <ul className="mb-6 space-y-2 text-sm">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-bayan-muted">
                      <span className="mt-0.5 text-bayan-teal">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                  {service.features.length > 3 && (
                    <li className="text-bayan-teal font-bold">+ {service.features.length - 3} more</li>
                  )}
                </ul>

                <button className="button primary w-full group-hover:bg-bayan-teal-dark">
                  Learn More
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="border-t border-bayan-border bg-bayan-surface px-4 py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-10 text-center">
            <h2 className="m-0 text-3xl font-black text-bayan-ink md:text-4xl">
              Requirements
            </h2>
            <p className="mt-2 text-lg text-bayan-muted">
              What you need to access our services
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="dashboard-section-card">
              <h3 className="m-0 text-xl font-black text-bayan-ink mb-4">For Citizens</h3>
              <ul className="space-y-3 text-bayan-muted">
                <li className="flex gap-2">
                  <span>✓</span> <span>Valid email address</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span> <span>Mobile phone number</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span> <span>Full name matching ID</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span> <span>Active email account</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span> <span>Internet connection</span>
                </li>
              </ul>
            </div>

            <div className="dashboard-section-card">
              <h3 className="m-0 text-xl font-black text-bayan-ink mb-4">For Submissions</h3>
              <ul className="space-y-3 text-bayan-muted">
                <li className="flex gap-2">
                  <span>✓</span> <span>Valid government-issued ID</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span> <span>Proof of residency (if required)</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span> <span>Supporting documents (as applicable)</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span> <span>Accurate contact information</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span> <span>Processing fee (if applicable)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="border-t border-bayan-border bg-white px-4 py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-10 text-center">
            <h2 className="m-0 text-3xl font-black text-bayan-ink md:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid gap-4 md:max-w-[800px] md:mx-auto">
            {[
              {
                q: "How do I create an account?",
                a: "Visit the citizen login page and click 'Sign Up'. Fill in your details and verify your email address.",
              },
              {
                q: "How long does document processing take?",
                a: "Processing times vary by service, typically 3-7 business days. Check the specific service details for estimates.",
              },
              {
                q: "Can I track my request status?",
                a: "Yes! Log into your account and use the Request Tracking feature to monitor progress in real-time.",
              },
              {
                q: "What payment methods are accepted?",
                a: "We accept online payments via debit/credit cards and online banking partners. Cash payment is available at office counters.",
              },
            ].map((item, index) => (
              <details
                key={index}
                className="group rounded-lg border border-bayan-border bg-white p-4 cursor-pointer hover:border-bayan-teal"
              >
                <summary className="flex items-start justify-between font-bold text-bayan-ink">
                  {item.q}
                  <span className="ml-4 text-bayan-teal">+</span>
                </summary>
                <p className="mt-4 m-0 text-bayan-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-bayan-navy to-bayan-navy-2 px-4 py-16 text-center text-white">
        <div className="mx-auto max-w-[600px]">
          <h2 className="m-0 text-3xl font-black md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-slate-200">
            Create your account today and access all our services.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/citizen/login" className="button primary">
              Register Now
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
