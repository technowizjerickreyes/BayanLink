export default function PublicFooter() {
  return (
    <footer className="border-t border-bayan-border bg-bayan-navy text-white">
      <div className="mx-auto max-w-[1120px] px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* About Section */}
          <div className="grid gap-3">
            <h3 className="text-sm font-black uppercase tracking-wide text-bayan-yellow">About</h3>
            <p className="text-sm text-slate-200">
              BayanLink is the official municipal portal for Aliaga, Nueva Ecija, providing seamless access to city services.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid gap-3">
            <h3 className="text-sm font-black uppercase tracking-wide text-bayan-yellow">Quick Links</h3>
            <ul className="grid gap-2 text-sm">
              <li><a href="/" className="transition hover:text-bayan-yellow">Home</a></li>
              <li><a href="/about" className="transition hover:text-bayan-yellow">About Aliaga</a></li>
              <li><a href="/services" className="transition hover:text-bayan-yellow">Services</a></li>
              <li><a href="/news" className="transition hover:text-bayan-yellow">News & Updates</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="grid gap-3">
            <h3 className="text-sm font-black uppercase tracking-wide text-bayan-yellow">Services</h3>
            <ul className="grid gap-2 text-sm">
              <li><a href="/citizen/login" className="transition hover:text-bayan-yellow">Document Requests</a></li>
              <li><a href="/citizen/login" className="transition hover:text-bayan-yellow">Appointments</a></li>
              <li><a href="/citizen/login" className="transition hover:text-bayan-yellow">Complaints</a></li>
              <li><a href="/citizen/login" className="transition hover:text-bayan-yellow">Tracking</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="grid gap-3">
            <h3 className="text-sm font-black uppercase tracking-wide text-bayan-yellow">Contact</h3>
            <div className="text-sm text-slate-200">
              <p className="m-0">Aliaga, Nueva Ecija</p>
              <p className="m-0">+63 (0) 44-294-1234</p>
              <p className="m-0">info@aliaga.gov.ph</p>
              <p className="m-0 mt-2">Mon-Fri: 8:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-slate-300">
          <p className="m-0">© 2024 Municipality of Aliaga. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
