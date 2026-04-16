import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import AppointmentCreatePage from "../pages/citizen/AppointmentCreatePage.jsx";
import AppointmentListPage from "../pages/citizen/AppointmentListPage.jsx";
import ComplaintCreatePage from "../pages/citizen/ComplaintCreatePage.jsx";
import ComplaintListPage from "../pages/citizen/ComplaintListPage.jsx";
import ComplaintViewPage from "../pages/citizen/ComplaintViewPage.jsx";
import BarangayDashboard from "../pages/barangay/BarangayDashboard.jsx";
import BarangayAppointmentManagementPage from "../pages/barangay/AppointmentManagementPage.jsx";
import BarangayComplaintManagementPage from "../pages/barangay/ComplaintManagementPage.jsx";
import BarangayDocumentRequestManagementPage from "../pages/barangay/DocumentRequestManagementPage.jsx";
import CitizenDashboard from "../pages/citizen/CitizenDashboard.jsx";
import DocumentRequestCreatePage from "../pages/citizen/DocumentRequestCreatePage.jsx";
import DocumentRequestListPage from "../pages/citizen/DocumentRequestListPage.jsx";
import DocumentServiceCatalogPage from "../pages/citizen/DocumentServiceCatalogPage.jsx";
import DocumentRequestViewPage from "../pages/citizen/DocumentRequestViewPage.jsx";
import MunicipalDashboard from "../pages/municipal-admin/MunicipalDashboard.jsx";
import MunicipalAppointmentManagementPage from "../pages/municipal-admin/AppointmentManagementPage.jsx";
import MunicipalComplaintManagementPage from "../pages/municipal-admin/ComplaintManagementPage.jsx";
import MunicipalDocumentRequestManagementPage from "../pages/municipal-admin/DocumentRequestManagementPage.jsx";
import NewsFeedCreatePage from "../pages/news/NewsFeedCreatePage.jsx";
import NewsFeedEditPage from "../pages/news/NewsFeedEditPage.jsx";
import NewsFeedListPage from "../pages/news/NewsFeedListPage.jsx";
import NewsFeedViewPage from "../pages/news/NewsFeedViewPage.jsx";
import RequestTrackingPage from "../pages/citizen/RequestTrackingPage.jsx";
import MunicipalityCreate from "../pages/super-admin/MunicipalityCreate.jsx";
import MunicipalityEdit from "../pages/super-admin/MunicipalityEdit.jsx";
import MunicipalityList from "../pages/super-admin/MunicipalityList.jsx";
import MunicipalityView from "../pages/super-admin/MunicipalityView.jsx";
import SuperAdminDashboard from "../pages/super-admin/SuperAdminDashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { DashboardRedirect, NewsRedirect } from "./RoleRedirect.jsx";

function LegacyMunicipalityRedirect({ action = "" }) {
  const { id } = useParams();
  const suffix = id ? `/${id}${action}` : "";
  return <Navigate replace to={`/super-admin/municipalities${suffix}`} />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/citizen/login" element={<LoginPage portalRole="citizen" />} />
        <Route path="/barangay/login" element={<LoginPage portalRole="barangay_admin" />} />
        <Route path="/municipal/login" element={<LoginPage portalRole="municipal_admin" />} />
        <Route path="/municipal-admin/login" element={<LoginPage portalRole="municipal_admin" />} />
        <Route path="/super-admin/login" element={<LoginPage portalRole="super_admin" />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardRedirect />} />

            <Route element={<ProtectedRoute roles={["super_admin"]} />}>
              <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
              <Route path="/super-admin/municipalities" element={<MunicipalityList />} />
              <Route path="/super-admin/municipalities/create" element={<MunicipalityCreate />} />
              <Route path="/super-admin/municipalities/:id" element={<MunicipalityView />} />
              <Route path="/super-admin/municipalities/:id/edit" element={<MunicipalityEdit />} />
              <Route path="/municipalities" element={<Navigate replace to="/super-admin/municipalities" />} />
              <Route path="/municipalities/create" element={<Navigate replace to="/super-admin/municipalities/create" />} />
              <Route path="/municipalities/:id" element={<LegacyMunicipalityRedirect />} />
              <Route path="/municipalities/:id/edit" element={<LegacyMunicipalityRedirect action="/edit" />} />
            </Route>

            <Route element={<ProtectedRoute roles={["municipal_admin"]} />}>
              <Route path="/municipal/dashboard" element={<MunicipalDashboard />} />
              <Route path="/municipal/document-requests" element={<MunicipalDocumentRequestManagementPage />} />
              <Route path="/municipal/appointments" element={<MunicipalAppointmentManagementPage />} />
              <Route path="/municipal/complaints" element={<MunicipalComplaintManagementPage />} />
              <Route path="/municipal/news-feeds" element={<NewsFeedListPage />} />
              <Route path="/municipal/news-feeds/create" element={<NewsFeedCreatePage />} />
              <Route path="/municipal/news-feeds/:id" element={<NewsFeedViewPage />} />
              <Route path="/municipal/news-feeds/:id/edit" element={<NewsFeedEditPage />} />
            </Route>

            <Route element={<ProtectedRoute roles={["barangay_admin"]} />}>
              <Route path="/barangay/dashboard" element={<BarangayDashboard />} />
              <Route path="/barangay/document-requests" element={<BarangayDocumentRequestManagementPage />} />
              <Route path="/barangay/appointments" element={<BarangayAppointmentManagementPage />} />
              <Route path="/barangay/complaints" element={<BarangayComplaintManagementPage />} />
              <Route path="/barangay/news-feeds" element={<NewsFeedListPage />} />
              <Route path="/barangay/news-feeds/create" element={<NewsFeedCreatePage />} />
              <Route path="/barangay/news-feeds/:id" element={<NewsFeedViewPage />} />
              <Route path="/barangay/news-feeds/:id/edit" element={<NewsFeedEditPage />} />
            </Route>

            <Route element={<ProtectedRoute roles={["citizen"]} />}>
              <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
              <Route path="/citizen/document-requests" element={<DocumentRequestListPage />} />
              <Route path="/citizen/document-requests/services" element={<DocumentServiceCatalogPage />} />
              <Route path="/citizen/document-requests/create" element={<DocumentRequestCreatePage />} />
              <Route path="/citizen/document-requests/:id" element={<DocumentRequestViewPage />} />
              <Route path="/citizen/request-tracking" element={<RequestTrackingPage />} />
              <Route path="/citizen/appointments" element={<AppointmentListPage />} />
              <Route path="/citizen/appointments/create" element={<AppointmentCreatePage />} />
              <Route path="/citizen/complaints" element={<ComplaintListPage />} />
              <Route path="/citizen/complaints/create" element={<ComplaintCreatePage />} />
              <Route path="/citizen/complaints/:id" element={<ComplaintViewPage />} />
              <Route path="/citizen/news-feed" element={<NewsFeedListPage />} />
              <Route path="/citizen/news-feed/:id" element={<NewsFeedViewPage />} />
            </Route>

            <Route path="/news-feeds" element={<NewsRedirect />} />
            <Route path="*" element={<Navigate replace to="/dashboard" />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
