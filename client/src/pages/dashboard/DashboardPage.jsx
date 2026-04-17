import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import Icon from "../../components/common/Icon.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { canManageNews, getNewsPath } from "../../utils/rolePaths.js";

export default function DashboardPage() {
  const { user } = useAuth();
  const newsPath = getNewsPath(user?.role);
  const managesNews = canManageNews(user?.role);
  const roleLabel = (user?.role || "workspace").replace("_", " ");
  const readyModules = [
    {
      title: managesNews ? "News Management" : "News Feed",
      description: managesNews ? "Create and maintain announcements within your assigned scope." : "Read announcements scoped to your municipality and barangay.",
      to: newsPath,
      icon: "news",
      count: "Ready",
    },
    {
      title: "Scoped Operations",
      description: "Requests, appointments, complaints, and reports stay constrained to the signed-in role.",
      to: "/dashboard",
      icon: "file",
      count: "Scaffold",
    },
  ];

  const statItems = [
    { label: "Session", value: "Active", icon: "people", tone: "success" },
    { label: "Scope", value: user?.barangayId ? "Barangay" : "Municipal", icon: "building", tone: "blue" },
    { label: "Security", value: "RBAC", icon: "lock", tone: "coral" },
  ];

  const priorityModules = [
    { label: "Document Requests", icon: "file" },
    { label: "Appointments", icon: "calendar" },
    { label: "Complaints", icon: "alert" },
    { label: "Reports", icon: "trend" },
    { label: "Profile", icon: "people" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-8 lg:mb-0">
              <p className="text-blue-100 font-semibold text-sm uppercase tracking-wide mb-2">
                BayanLink Portal
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                {roleLabel} Workspace
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl">
                Role-based access keeps every workflow scoped to the signed-in user, municipality, and barangay.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/news-feeds"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Icon name="news" />
                <span>News Feed</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statItems.map((item) => (
              <div key={item.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    item.tone === 'success' ? 'bg-green-100 text-green-600' :
                    item.tone === 'blue' ? 'bg-blue-100 text-blue-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    <Icon name={item.icon} size={24} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    item.tone === 'success' ? 'bg-green-100 text-green-800' :
                    item.tone === 'blue' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    Active
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{item.label}</h3>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Announcements / News Feed Section */}
        <section className="mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">📢 Municipal Announcements</h2>
            
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <div className="flex items-start gap-3">
                  <span className="text-lg">💬</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Distribution of ayuda tomorrow</h3>
                    <p className="text-sm text-gray-600">Please proceed to your respective barangay halls for the scheduled cash assistance distribution.</p>
                    <p className="text-xs text-gray-500 mt-1">Posted 2 hours ago</p>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-gray-100 pb-3">
                <div className="flex items-start gap-3">
                  <span className="text-lg">🚧</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Road repair at Barangay 3</h3>
                    <p className="text-sm text-gray-600">Major road rehabilitation project will start next week. Please expect traffic rerouting.</p>
                    <p className="text-xs text-gray-500 mt-1">Posted 5 hours ago</p>
                  </div>
                </div>
              </div>
              
              <div className="pb-3">
                <div className="flex items-start gap-3">
                  <span className="text-lg">🏥</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Free medical clinic on Saturday</h3>
                    <p className="text-sm text-gray-600">RHU will conduct free medical check-ups and vaccination at the municipal gymnasium.</p>
                    <p className="text-xs text-gray-500 mt-1">Posted 1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <button className="btn-secondary text-sm">
                View All Announcements
              </button>
            </div>
          </div>
        </section>

        {/* Service Workspaces */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-2">
                Active Modules
              </p>
              <h2 className="text-2xl font-bold text-gray-900">Service Workspaces</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {readyModules.map((module) => (
              <Link 
                key={module.to} 
                to={module.to}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Icon name={module.icon} size={24} />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {module.count}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {module.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {module.description}
                </p>
                <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                  <span>Access Module</span>
                  <Icon name="arrow-right" size={16} className="ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Announcements Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="news" size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Latest Announcements</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Stay updated with the latest municipal news and announcements relevant to your role and scope.
                </p>
                <Link 
                  to="/news-feeds"
                  className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium text-sm"
                >
                  View All Announcements
                  <Icon name="arrow-right" size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Priority Modules */}
        <section>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-2">
                Development Queue
              </p>
              <h2 className="text-2xl font-bold text-gray-900">Priority Modules</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {priorityModules.map((module) => (
                <div key={module.label} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon name={module.icon} size={20} />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{module.label}</p>
                  <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
