import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Icon from "../../components/common/Icon.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";
import { register } from "../../services/authService.js";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    phone: "",
    affiliate: "",
    municipalityId: "",
    barangayId: "",
    password: "",
    passwordConfirm: "",
  });
  const [municipalities, setMunicipalities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [error, setError] = useState("");
  const [helperMessage, setHelperMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Use the same api base url resolution as api.js
  const apiBase = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api")
    .trim()
    .replace(/\/$/, "");

  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const response = await fetch(`${apiBase}/public/municipality/info`);
        if (response.ok) {
          const data = await response.json();
          const list = data.data || [];
          setMunicipalities(list);
          if (list.length > 0) {
            setForm((prev) => ({ ...prev, municipalityId: list[0]._id }));
          }
        }
      } catch (err) {
        console.error("Error fetching municipalities:", err);
      }
    };
    fetchMunicipalities();
  }, [apiBase]);

  useEffect(() => {
    if (!form.municipalityId) return;
    const fetchBarangays = async () => {
      try {
        const response = await fetch(`${apiBase}/public/barangays?municipalityId=${form.municipalityId}`);
        if (response.ok) {
          const data = await response.json();
          const list = data.data || [];
          setBarangays(list);
          if (list.length > 0) {
            setForm((prev) => ({ ...prev, barangayId: list[0].code }));
          }
        }
      } catch (err) {
        console.error("Error fetching barangays:", err);
      }
    };
    fetchBarangays();
  }, [form.municipalityId, apiBase]);

  if (loading) {
    return (
      <main className="login-page">
        <StatusMessage>Checking secure session...</StatusMessage>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate replace to="/citizen/dashboard" />;
  }

  const handleChange = (event) => {
    setError("");
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.fullName.trim()) { setError("Full name is required"); return; }
    if (form.password.length < 12) { setError("Password must be at least 12 characters"); return; }
    if (form.password !== form.passwordConfirm) { setError("Passwords do not match"); return; }
    if (!form.municipalityId || !form.barangayId) { setError("Municipality and barangay are required"); return; }

    try {
      setSubmitting(true);
      setError("");
      setHelperMessage("");

      await register({
        email: form.email.trim(),
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        affiliate: form.affiliate.trim(),
        municipalityId: form.municipalityId,
        barangayId: form.barangayId,
        password: form.password,
        passwordConfirm: form.passwordConfirm,
      });

      setHelperMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/citizen/login"), 2000);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const passwordStrength = form.password.length === 0 ? null : form.password.length >= 12 ? "strong" : "weak";
  const passwordsMatch = form.password && form.password === form.passwordConfirm;

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-stage">
          <aside className="login-aside">
            <div className="brand login-brand">
              <span className="brand-mark">A</span>
              <div>
                <strong>BayanLink</strong>
                <small>Aliaga Municipal Portal</small>
              </div>
            </div>
            <div className="login-copy">
              <p className="eyebrow">Get Started</p>
              <h1>Create Your Account</h1>
              <p className="login-subtitle">
                Join Aliaga Municipal Portal to access services, submit requests, track transactions, and stay informed with local updates.
              </p>
            </div>
            <div className="login-role-card">
              <span className="login-portal-badge">Citizen access</span>
              <p>Create your citizen account to access self-service features within Aliaga municipality.</p>
            </div>
            <div className="login-highlight-list" aria-label="Benefits">
              {[
                { icon: "file", title: "Easy requests", desc: "Submit and track service requests without visiting the office." },
                { icon: "calendar", title: "Schedule appointments", desc: "Reduce waiting time with convenient appointment scheduling." },
                { icon: "lock", title: "Secure and private", desc: "Your account is secured and scoped to your municipality and barangay." },
              ].map((item) => (
                <article className="login-highlight" key={item.title}>
                  <span className="login-highlight-icon"><Icon name={item.icon} size={18} /></span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>

          <section className="login-panel">
            <div className="login-panel-head">
              <p className="eyebrow">Sign up</p>
              <h2>Create your citizen account</h2>
              <p>Fill in your details to get started with Aliaga BayanLink.</p>
            </div>

            {error && <StatusMessage type="error">{error}</StatusMessage>}
            {helperMessage && (
              <div className="login-helper-note" role="status">
                <Icon name="check-circle" size={16} />
                <span>{helperMessage}</span>
              </div>
            )}

            <form aria-busy={submitting} className="form-panel login-form" onSubmit={handleSubmit}>
              {/* Email */}
              <label className="field">
                <span>Email</span>
                <input
                  autoComplete="email"
                  autoFocus
                  disabled={submitting}
                  name="email"
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  type="email"
                  value={form.email}
                />
              </label>

              {/* Full Name */}
              <label className="field">
                <span>Full Name</span>
                <input
                  disabled={submitting}
                  name="fullName"
                  onChange={handleChange}
                  placeholder="Juan Dela Cruz"
                  required
                  type="text"
                  value={form.fullName}
                />
              </label>

              {/* Phone & Affiliate row */}
              <div className="form-grid two">
                <label className="field">
                  <span>Phone (optional)</span>
                  <input
                    disabled={submitting}
                    name="phone"
                    onChange={handleChange}
                    placeholder="+63-9xx-xxx-xxxx"
                    type="tel"
                    value={form.phone}
                  />
                </label>
                <label className="field">
                  <span>Affiliate (optional)</span>
                  <input
                    disabled={submitting}
                    name="affiliate"
                    onChange={handleChange}
                    placeholder="Organization or barangay"
                    type="text"
                    value={form.affiliate}
                  />
                </label>
              </div>

              {/* Municipality & Barangay row */}
              <div className="form-grid two">
                <label className="field">
                  <span>Municipality</span>
                  <select
                    disabled={submitting || municipalities.length === 0}
                    name="municipalityId"
                    onChange={handleChange}
                    required
                    value={form.municipalityId}
                  >
                    {municipalities.length === 0 && <option value="">Loading...</option>}
                    {municipalities.map((m) => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Barangay</span>
                  <select
                    disabled={submitting || barangays.length === 0}
                    name="barangayId"
                    onChange={handleChange}
                    required
                    value={form.barangayId}
                  >
                    {barangays.length === 0 && <option value="">Select municipality first</option>}
                    {barangays.map((b) => (
                      <option key={b.code} value={b.code}>{b.name}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Password */}
              <div className="field">
                <span>Password</span>
                <div className="field-input-group">
                  <input
                    className="form-control"
                    disabled={submitting}
                    name="password"
                    onChange={handleChange}
                    placeholder="Min. 12 characters"
                    required
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                  />
                  <button
                    className="field-inline-action"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    type="button"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {passwordStrength && (
                  <small className={passwordStrength === "strong" ? "text-emerald-700 font-bold" : "field-error"}>
                    Password strength: {passwordStrength}
                  </small>
                )}
              </div>

              {/* Confirm Password */}
              <div className="field">
                <span>Confirm Password</span>
                <div className="field-input-group">
                  <input
                    className="form-control"
                    disabled={submitting}
                    name="passwordConfirm"
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    required
                    type={showPassword ? "text" : "password"}
                    value={form.passwordConfirm}
                  />
                </div>
                {form.passwordConfirm && (
                  <small className={passwordsMatch ? "text-emerald-700 font-bold" : "field-error"}>
                    {passwordsMatch ? "Passwords match ✓" : "Passwords do not match"}
                  </small>
                )}
              </div>

              <button
                aria-busy={submitting}
                className="button primary"
                disabled={submitting || !passwordsMatch || form.password.length < 12}
                type="submit"
              >
                {submitting ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-bayan-muted" style={{ marginTop: 16 }}>
              Already have an account?{" "}
              <Link to="/citizen/login" className="font-bold text-bayan-teal hover:text-bayan-teal-dark">
                Sign in here
              </Link>
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
