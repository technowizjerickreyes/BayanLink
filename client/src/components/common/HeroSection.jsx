export default function HeroSection({ 
  title, 
  subtitle, 
  backgroundClass = "bg-gradient-to-br from-bayan-navy to-bayan-navy-2",
  children 
}) {
  return (
    <section className={`relative overflow-hidden px-4 py-16 text-white sm:py-24 md:py-32 ${backgroundClass}`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-bayan-yellow blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-bayan-teal blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1120px]">
        <div className="grid gap-6 md:gap-8">
          <div className="grid gap-4">
            <h1 className="text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
              {title}
            </h1>
            {subtitle && (
              <p className="max-w-[600px] text-lg text-slate-200 md:text-xl">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
