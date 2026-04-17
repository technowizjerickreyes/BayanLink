export default function PublicFooter() {
  return (
    <footer className="border-t border-bayan-border bg-bayan-navy text-white">
      <div className="mx-auto max-w-[1120px] px-4 py-12">
        {/* Footer Top with Municipal Hall Image */}
        <div className="mb-12 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="text-lg font-black uppercase tracking-wide text-bayan-yellow mb-3">Aliaga Municipal Portal</h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              BayanLink is the official municipal portal for Aliaga, Nueva Ecija, providing seamless access to city services, information, and online transactions for all residents.
            </p>
          </div>
          <div className="hidden md:flex justify-center">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aliaga_Nueva_Ecija-dieHQ6M42us6abrNxyS40PP1QYjKUX.png"
              alt="Municipality of Aliaga Official Seal"
              className="h-24 w-24 opacity-90"
            />
          </div>
        </div>

        <hr className="border-white/10 mb-8" />

        {/* Footer Links Grid */}
        <div className="grid gap-8 md:grid-cols-4">
          {/* About Section */}
          <div className="grid gap-3">
            <h3 className="text-sm font-black uppercase tracking-wide text-bayan-yellow">About</h3>
            <ul className="grid gap-2 text-sm">
              <li><a href="/about" className="text-slate-200 transition hover:text-bayan-yellow">About Aliaga</a></li>
              <li><a href="/" className="text-slate-200 transition hover:text-bayan-yellow">Our Seal</a></li>
              <li><a href="/" className="text-slate-200 transition hover:text-bayan-yellow">History</a></li>
              <li><a href="/" className="text-slate-200 transition hover:text-bayan-yellow">Barangays</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="grid gap-3">
            <h3 className="text-sm font-black uppercase tracking-wide text-bayan-yellow">Quick Links</h3>
            <ul className="grid gap-2 text-sm">
              <li><a href="/" className="text-slate-200 transition hover:text-bayan-yellow">Home</a></li>
              <li><a href="/about" className="text-slate-200 transition hover:text-bayan-yellow">About Aliaga</a></li>
              <li><a href="/services" className="text-slate-200 transition hover:text-bayan-yellow">Services</a></li>
              <li><a href="/news" className="text-slate-200 transition hover:text-bayan-yellow">News & Updates</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="grid gap-3">
            <h3 className="text-sm font-black uppercase tracking-wide text-bayan-yellow">Services</h3>
            <ul className="grid gap-2 text-sm">
              <li><a href="/citizen/login" className="text-slate-200 transition hover:text-bayan-yellow">Document Requests</a></li>
              <li><a href="/citizen/login" className="text-slate-200 transition hover:text-bayan-yellow">Appointments</a></li>
              <li><a href="/citizen/login" className="text-slate-200 transition hover:text-bayan-yellow">Complaints</a></li>
              <li><a href="/citizen/login" className="text-slate-200 transition hover:text-bayan-yellow">Tracking</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="grid gap-3">
            <h3 className="text-sm font-black uppercase tracking-wide text-bayan-yellow">Contact</h3>
            <div className="text-sm text-slate-200">
              <p className="m-0 mb-1">Municipality of Aliaga</p>
              <p className="m-0 mb-1">Nueva Ecija, Philippines</p>
              <p className="m-0 mb-3 border-b border-white/20 pb-3">+63 (0) 44-294-1234</p>
              <p className="m-0 text-xs">Mon-Fri: 8:00 AM - 5:00 PM<br />Sat-Sun: Closed</p>
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
