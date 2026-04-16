import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import FormInput from "../../components/common/FormInput.jsx";
import Icon from "../../components/common/Icon.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";

const landingByRole = {
  super_admin: "/super-admin/dashboard",
  municipal_admin: "/municipal/dashboard",
  barangay_admin: "/barangay/dashboard",
  citizen: "/citizen/dashboard",
};

const portalConfig = {
  citizen: {
    title: "Citizen Portal",
    eyebrow: "Digital public services",
    subtitle: "Access document requests, appointments, complaints, and local updates from a single secure citizen account.",
    signInTitle: "Sign in to your citizen account",
    signInDescription: "Use the email and password registered for your municipality and barangay access.",
    accessLabel: "Citizen access",
    accessNote: "For residents using BayanLink self-service features within their assigned municipality and barangay.",
    supportNote: "Need help with access? Please coordinate with your barangay office or municipal help desk.",
    highlights: [
      { icon: "file", title: "Self-service requests", description: "Submit and track citizen transactions without visiting the office first." },
      { icon: "calendar", title: "Appointment-ready", description: "Reduce queueing with scheduled visits and release pickups." },
      { icon: "lock", title: "Scoped access", description: "Your account only shows records within your own municipality and barangay scope." },
    ],
  },
  barangay_admin: {
    title: "Barangay Portal",
    eyebrow: "Barangay operations",
    subtitle: "Manage localized services, review resident concerns, and coordinate barangay-level workflows securely.",
    signInTitle: "Sign in to the barangay workspace",
    signInDescription: "This portal is limited to authorized barangay personnel assigned to their own barangay scope.",
    accessLabel: "Barangay admin only",
    accessNote: "Use this portal only if your account is assigned as a barangay administrator in BayanLink.",
    supportNote: "If you cannot access this portal, please contact your municipal administrator for account verification.",
    highlights: [
      { icon: "people", title: "Barangay-scoped review", description: "Handle requests and reports only for your assigned barangay." },
      { icon: "tracking", title: "Workflow visibility", description: "Keep residents informed with accurate status updates and remarks." },
      { icon: "lock", title: "Protected access", description: "Sensitive actions remain restricted and logged for accountability." },
    ],
  },
  municipal_admin: {
    title: "Municipal Admin Portal",
    eyebrow: "Municipality operations",
    subtitle: "Coordinate municipality-wide services, announcements, appointments, and complaint response inside your approved scope.",
    signInTitle: "Sign in to the municipal workspace",
    signInDescription: "This portal is reserved for authorized municipal administrators assigned to a specific municipality.",
    accessLabel: "Municipal admin only",
    accessNote: "Use your approved municipal administrator account to access municipality-wide operations and monitoring tools.",
    supportNote: "For account issues, please coordinate with the BayanLink super administrator or your LGU system owner.",
    highlights: [
      { icon: "building", title: "Municipality-wide oversight", description: "Review citizen requests, complaints, and schedules across your municipality." },
      { icon: "news", title: "Official communications", description: "Publish scoped announcements and keep public information organized." },
      { icon: "lock", title: "Server-side controls", description: "Actions remain protected by role validation, scope checks, and audit logging." },
    ],
  },
  super_admin: {
    title: "Super Admin Portal",
    eyebrow: "Master administration",
    subtitle: "Maintain municipality master records and controlled system-level administration without handling citizen-facing operations.",
    signInTitle: "Sign in to the super admin workspace",
    signInDescription: "Restricted to master administrators responsible for BayanLink municipality record governance.",
    accessLabel: "Super admin only",
    accessNote: "Use this portal only for municipality master management and high-level administrative controls.",
    supportNote: "If your account should have system access but does not, verify your role assignment before attempting again.",
    highlights: [
      { icon: "building", title: "Municipality master records", description: "Maintain protected municipality records without overreaching into local operations." },
      { icon: "tracking", title: "Controlled updates", description: "Review sensitive activity with clear boundaries and accountable workflows." },
      { icon: "lock", title: "High-trust access", description: "Super admin authentication is reserved for limited, auditable management actions." },
    ],
  },
};

const defaultPortalConfig = {
  title: "BayanLink Access",
  eyebrow: "Secure government platform",
  subtitle: "Unified citizen engagement and municipal service platform for residents, barangays, and local government administrators.",
  signInTitle: "Sign in to BayanLink",
  signInDescription: "Use your approved BayanLink account to access the portal assigned to your role.",
  accessLabel: "Secure access",
  accessNote: "Use the portal link provided by your municipality if your account is role-specific.",
  supportNote: "Password recovery and self-service account support will be expanded in a later phase.",
  highlights: [
    { icon: "file", title: "Citizen transactions", description: "Requests, appointments, and reports are available in one organized service workspace." },
    { icon: "building", title: "Local government ready", description: "Designed for citizens, barangays, municipalities, and controlled super admin access." },
    { icon: "lock", title: "Protected by scope", description: "Role, municipality, and barangay boundaries are enforced throughout the platform." },
  ],
};

const LOGIN_MEMORY_KEY = "bayanlink_login_memory";

function readLoginMemory() {
  try {
    const raw = localStorage.getItem(LOGIN_MEMORY_KEY);

    if (!raw) {
      return { email: "", rememberMe: false };
    }

    const parsed = JSON.parse(raw);
    return {
      email: typeof parsed.email === "string" ? parsed.email : "",
      rememberMe: Boolean(parsed.rememberMe),
    };
  } catch (_error) {
    return { email: "", rememberMe: false };
  }
}

export default function LoginPage({ portalRole = "" }) {
  const portal = useMemo(() => portalConfig[portalRole] || defaultPortalConfig, [portalRole]);
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [helperMessage, setHelperMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated, loading, login, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const remembered = readLoginMemory();
    setRememberMe(remembered.rememberMe);
    setForm((current) => ({
      ...current,
      email: remembered.email,
    }));
  }, [portalRole]);

  if (loading) {
    return (
      <main className="login-page">
        <StatusMessage>Checking secure session...</StatusMessage>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate replace to={landingByRole[user?.role] || "/dashboard"} />;
  }

  const handleChange = (event) => {
    setError("");
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setHelperMessage("");
      const payload = {
        email: form.email.trim(),
        password: form.password,
      };
      const response = await login(payload);

      if (portalRole && response.data.user.role !== portalRole) {
        await logout();
        setError("This account is not allowed in this portal.");
        return;
      }

      if (rememberMe) {
        localStorage.setItem(
          LOGIN_MEMORY_KEY,
          JSON.stringify({
            email: payload.email,
            rememberMe: true,
          })
        );
      } else {
        localStorage.removeItem(LOGIN_MEMORY_KEY);
      }

      const destination = location.state?.from?.pathname || landingByRole[response.data.user.role] || "/dashboard";
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-stage">
          <aside className="login-aside">
            <div className="brand login-brand">
              <span className="brand-mark">BL</span>
              <div>
                <strong>BayanLink</strong>
                <small>Municipal citizen engagement platform</small>
              </div>
            </div>

            <div className="login-copy">
              <p className="eyebrow">{portal.eyebrow}</p>
              <h1>{portal.title}</h1>
              <p className="login-subtitle">{portal.subtitle}</p>
            </div>

            <div className="login-role-card">
              <span className="login-portal-badge">{portal.accessLabel}</span>
              <p>{portal.accessNote}</p>
            </div>

            <div className="login-highlight-list" aria-label="Platform highlights">
              {portal.highlights.map((item) => (
                <article className="login-highlight" key={item.title}>
                  <span className="login-highlight-icon">
                    <Icon name={item.icon} size={18} />
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>

          <section className="login-panel">
            <div className="login-panel-head">
              <p className="eyebrow">Sign in</p>
              <h2>{portal.signInTitle}</h2>
              <p>{portal.signInDescription}</p>
            </div>

            {error && <StatusMessage type="error">{error}</StatusMessage>}
            {helperMessage && (
              <div className="login-helper-note" role="status">
                <Icon name="lock" size={16} />
                <span>{helperMessage}</span>
              </div>
            )}

            <form aria-busy={submitting} className="form-panel login-form" onSubmit={handleSubmit}>
              <FormInput
                autoComplete="email"
                autoFocus
                disabled={submitting}
                hint="Use the email registered for your BayanLink account."
                label="Email address"
                name="email"
                onChange={handleChange}
                required
                type="email"
                value={form.email}
              />

              <div className="field">
                <label className="form-label mb-0" htmlFor="login-password">
                  Password
                </label>
                <div className="field-input-group">
                  <input
                    autoComplete="current-password"
                    className="form-control"
                    disabled={submitting}
                    id="login-password"
                    name="password"
                    onChange={handleChange}
                    required
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                  />
                  <button
                    aria-controls="login-password"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="field-inline-action"
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                  >
                    <Icon name={showPassword ? "hide" : "view"} size={16} />
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>
              </div>

              <div className="login-form-row">
                <FormInput
                  checked={rememberMe}
                  disabled={submitting}
                  label="Remember email on this device"
                  name="rememberMe"
                  onChange={(event) => setRememberMe(event.target.checked)}
                  type="checkbox"
                />
                <button
                  className="login-link-button"
                  onClick={() =>
                    setHelperMessage(
                      portalRole === "citizen"
                        ? "Password recovery will be added in a later phase. For now, please contact your barangay office or municipal help desk for assistance."
                        : "Password recovery is not yet connected in this portal. Please coordinate with your authorized system administrator."
                    )
                  }
                  type="button"
                >
                  Forgot password?
                </button>
              </div>

              <button className="button primary btn btn-success login-submit" disabled={submitting} type="submit">
                {submitting ? <span className="loading-dot" /> : <Icon name="check" />}
                <span>{submitting ? "Signing in securely..." : "Sign in"}</span>
              </button>
            </form>

            <div className="login-footnote">
              <strong>Need access support?</strong>
              <p>{portal.supportNote}</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
