import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
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
    <main className="min-h-screen bg-gray-50">
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Image & Branding */}
        <div className="lg:w-1/2 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
               style={{backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"}}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-green-700/80"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-8 lg:p-12 text-white">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-blue-900 font-bold text-xl shadow-lg">
                A
              </div>
              <div>
                <h1 className="text-2xl font-bold">BayanLink</h1>
                <p className="text-blue-100 text-sm">Aliaga Municipal Portal</p>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center max-w-md">
              <p className="text-amber-400 font-semibold text-sm uppercase tracking-wide mb-4">
                {portal.eyebrow}
              </p>
              <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
                {portal.title}
              </h2>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                {portal.subtitle}
              </p>
              
              {/* Features */}
              <div className="space-y-4">
                {portal.highlights.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                      <Icon name={item.icon} size={16} className="text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-blue-100 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bottom Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-500 text-blue-900 text-xs font-bold px-2 py-1 rounded-full">
                  {portal.accessLabel}
                </span>
              </div>
              <p className="text-sm text-blue-100">{portal.accessNote}</p>
            </div>
          </div>
        </div>

          {/* Right Side - Login Form */}
        <div className="lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md p-8 shadow-xl rounded-2xl">
            {/* Logo */}
            <img src="/logo.png" className="w-16 mx-auto mb-6" alt="Aliaga Municipal Logo" />

            {/* Form Header */}
            <div className="mb-8">
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-2">
                Secure Access
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {portal.signInTitle}
              </h2>
              <p className="text-gray-600">
                {portal.signInDescription}
              </p>
            </div>

            {/* Error/Helper Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <Icon name="alert" size={16} />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}
            
            {helperMessage && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <Icon name="lock" size={16} />
                  <span className="text-sm">{helperMessage}</span>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  disabled={submitting}
                  className="input"
                  placeholder="your@email.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    disabled={submitting}
                    className="input pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={submitting}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    <Icon name={showPassword ? "hide" : "view"} size={20} />
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={submitting}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember email</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setHelperMessage(
                      portalRole === "citizen"
                        ? "Password recovery will be added in a later phase. For now, please contact your barangay office or municipal help desk for assistance."
                        : "Password recovery is not yet connected in this portal. Please coordinate with your authorized system administrator."
                    )
                  }
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Icon name="check" size={16} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Support Info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-1">Need Access Support?</h3>
              <p className="text-sm text-gray-600">{portal.supportNote}</p>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
