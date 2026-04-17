/**
 * Aliaga Municipality Branding Component
 * Displays municipality information and branding
 */
export default function AliaagaBrandingInfo() {
  return (
    <div className="space-y-4">
      {/* Municipality Name */}
      <div>
        <p className="eyebrow">MUNICIPALITY PORTAL</p>
        <h1 className="m-0 text-3xl font-black text-bayan-ink">
          Aliaga, Nueva Ecija
        </h1>
        <p className="mt-2 m-0 text-bayan-muted">
          Official Digital Portal for Municipal Services
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="dashboard-mini-stat">
          <span>Population</span>
          <strong>72,134</strong>
        </div>
        <div className="dashboard-mini-stat">
          <span>Barangays</span>
          <strong>14</strong>
        </div>
        <div className="dashboard-mini-stat">
          <span>Services</span>
          <strong>50+</strong>
        </div>
      </div>

      {/* Municipality Seal / Branding */}
      <div className="flex items-center gap-4 rounded-lg border border-bayan-border bg-white p-4">
        <div className="grid h-16 w-16 place-items-center rounded-lg bg-bayan-teal-soft text-3xl text-bayan-teal font-black">
          A
        </div>
        <div className="min-w-0">
          <strong className="block text-sm text-bayan-ink">Municipality Seal</strong>
          <p className="m-0 text-xs text-bayan-muted">
            Official seal of the Municipality of Aliaga
          </p>
        </div>
      </div>
    </div>
  );
}
