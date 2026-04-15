import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import MunicipalityCreatePage from "../pages/municipality/MunicipalityCreatePage.jsx";
import MunicipalityEditPage from "../pages/municipality/MunicipalityEditPage.jsx";
import MunicipalityListPage from "../pages/municipality/MunicipalityListPage.jsx";
import MunicipalityViewPage from "../pages/municipality/MunicipalityViewPage.jsx";
import NewsFeedCreatePage from "../pages/news/NewsFeedCreatePage.jsx";
import NewsFeedEditPage from "../pages/news/NewsFeedEditPage.jsx";
import NewsFeedListPage from "../pages/news/NewsFeedListPage.jsx";
import NewsFeedViewPage from "../pages/news/NewsFeedViewPage.jsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate replace to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/municipalities" element={<MunicipalityListPage />} />
          <Route path="/municipalities/create" element={<MunicipalityCreatePage />} />
          <Route path="/municipalities/:id" element={<MunicipalityViewPage />} />
          <Route path="/municipalities/:id/edit" element={<MunicipalityEditPage />} />
          <Route path="/news-feeds" element={<NewsFeedListPage />} />
          <Route path="/news-feeds/create" element={<NewsFeedCreatePage />} />
          <Route path="/news-feeds/:id" element={<NewsFeedViewPage />} />
          <Route path="/news-feeds/:id/edit" element={<NewsFeedEditPage />} />
          <Route path="*" element={<Navigate replace to="/dashboard" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
