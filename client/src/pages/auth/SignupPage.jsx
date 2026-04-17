import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import FormInput from "../../components/common/FormInput.jsx";
import Icon from "../../components/common/Icon.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  // Fetch municipalities on mount
  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const response = await fetch(`${API_URL}/api/public/municipality/info`);
        if (response.ok) {
          const data = await response.json();
          setMunicipalities(data.data || []);
          if (data.data?.length > 0) {
            setForm((prev) => ({ ...prev, municipalityId: data.data[0]._id }));
          }
        }
      } catch (err) {
        console.error("Error fetching municipalities:", err);
      }
    };
    fetchMunicipalities();
  }, []);

  // Fetch barangays when municipality changes
  useEffect(() => {
    if (!form.municipalityId) return;

    const fetchBarangays = async () => {
      try {
        const response = await fetch(`${API_URL}/api/public/barangays?municipalityId=${form.municipalityId}`);
        if (response.ok) {
          const data = await response.json();
          setBarangays(data.data || []);
          if (data.data?.length > 0) {
            setForm((prev) => ({ ...prev, barangayId: data.data[0].code }));
          }
        }
      } catch (err) {
        console.error("Error fetching barangays:", err);
      }
    };
    fetchBarangays();
  }, [form.municipalityId]);

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

    // Validation
    if (!form.fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (form.password.length < 12) {
      setError("Password must be at least 12 characters");
      return;
    }

    if (form.password !== form.passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    if (!form.municipalityId || !form.barangayId) {
      setError("Municipality and barangay are required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setHelperMessage("");

      const payload = {
        email: form.email.trim(),
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        affiliate: form.affiliate.trim(),
        municipalityId: form.municipalityId,
        barangayId: form.barangayId,
        password: form.password,
        passwordConfirm: form.passwordConfirm,
      };

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }

      setHelperMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (requestError) {
      setError(requestError.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const passwordStrength = form.password.length >= 12 ? "strong" : "weak";
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
              <article className="login-highlight">
                <span className="login-highlight-icon">
                  <Icon name="file" size={18} />
                </span>
                <div>
                  <strong>Easy requests</strong>
                  <p>Submit and track service requests without visiting the office.</p>
                </div>
              </article>
              <article className="login-highlight">
                <span className="login-highlight-icon">
                  <Icon name="calendar" size={18} />
                </span>
                <div>
                  <strong>Schedule appointments</strong>
                  <p>Reduce waiting time with convenient appointment scheduling.</p>
                </div>
              </article>
              <article className="login-highlight">
                <span className="login-highlight-icon">
                  <Icon name="lock" size={18} />
                </span>
                <div>
                  <strong>Secure and private</strong>
                  <p>Your account is secured and scoped to your municipality and barangay.</p>
                </div>
              </article>
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
              <FormInput
                autoComplete="email"
                autoFocus
                label="Email"
                name="email"
                onChange={handleChange}
                placeholder="your@email.com"
                required
                type="email"
                value={form.email}
              />

              <FormInput
                label="Full Name"
                name="fullName"
                onChange={handleChange}
                placeholder="Juan Dela Cruz"
                required
                type="text"
                value={form.fullName}
              />

              <div className="form-row">
                <FormInput
                  label="Phone (optional)"
                  name="phone"
                  onChange={handleChange}
                  placeholder="+63-9xx-xxx-xxxx"
                  type="tel"
                  value={form.phone}
                />
                <FormInput
                  label="Affiliate (optional)"
                  name="affiliate"
                  onChange={handleChange}
                  placeholder="Organization or barangay"
                  type="text"
                  value={form.affiliate}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="municipalityId">Municipality</label>
                  <select
                    id="municipalityId"
                    name="municipalityId"
                    onChange={handleChange}
                    required
                    value={form.municipalityId}
                  >
                    {municipalities.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="barangayId">Barangay</label>
                  <select
                    id="barangayId"
                    name="barangayId"
                    onChange={handleChange}
                    required
                    value={form.barangayId}
                  >
                    {barangays.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <FormInput
                label="Password"
                name="password"
                onChange={handleChange}
                placeholder="Min. 12 characters, uppercase, number, symbol"
                required
                showToggle
                type={showPassword ? "text" : "password"}
                value={form.password}
                onToggleVisibility={() => setShowPassword(!showPassword)}
              />

              <FormInput
                label="Confirm Password"
                name="passwordConfirm"
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
                showToggle
                type={showPassword ? "text" : "password"}
                value={form.passwordConfirm}
              />

              {form.password && (
                <div className="form-hint" style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{ color: passwordStrength === "strong" ? "#0f766e" : "#b42318" }}>
                      Password strength: {passwordStrength}
                    </span>
                  </div>
                  {passwordsMatch && form.password.length >= 12 && (
                    <span style={{ color: "#0f766e", fontSize: "12px" }}>Passwords match ✓</span>
                  )}
                </div>
              )}

              <button
                aria-busy={submitting}
                className="button primary full-width"
                disabled={submitting || !passwordsMatch || form.password.length < 12}
                type="submit"
              >
                {submitting ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center" style={{ marginTop: "16px", color: "var(--color-bayan-muted)" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "var(--color-bayan-teal)", textDecoration: "none", fontWeight: 600 }}>
                Sign in here
              </Link>
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
