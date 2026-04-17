import asyncHandler from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { listVisibleNews } from "../services/newsFeedService.js";

/**
 * GET /api/public/news
 * Get featured/public news articles without authentication
 */
export const getPublicNews = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  
  // Fetch news without requiring user authentication
  const result = await listVisibleNews({ 
    user: null,  // No authenticated user
    query: { featured: true, ...req.query }, 
    pagination 
  });

  return sendSuccess(res, {
    message: "Public news loaded",
    data: result.items,
    meta: result.meta,
  });
});

/**
 * GET /api/public/municipality/stats
 * Get municipality statistics
 */
export const getMunicipalityStats = asyncHandler(async (_req, res) => {
  const stats = {
    population: 72134,
    barangays: 14,
    servicesAvailable: 50,
    activeUsers: 8500,
  };

  return sendSuccess(res, {
    message: "Municipality statistics loaded",
    data: stats,
  });
});

/**
 * GET /api/public/municipality/info
 * Get public municipality information
 */
export const getMunicipalityInfo = asyncHandler(async (_req, res) => {
  const info = {
    name: "Municipality of Aliaga",
    province: "Nueva Ecija",
    region: "CALABARZON",
    population: 72134,
    landArea: "68 square kilometers",
    barangays: 14,
    description: "A progressive municipality committed to delivering high-quality services and fostering sustainable development.",
    motto: "Progress, Justice, and Community Empowerment",
    contactEmail: "info@aliaga.gov.ph",
    contactPhone: "+63 (0) 44-294-1234",
    operatingHours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
  };

  return sendSuccess(res, {
    message: "Municipality information loaded",
    data: info,
  });
});

/**
 * GET /api/public/services/catalog
 * Get list of available public services
 */
export const getServicesCatalog = asyncHandler(async (_req, res) => {
  const services = [
    {
      id: "document-requests",
      name: "Document Requests",
      description: "Request official documents and certificates",
      icon: "file-text",
      category: "Services",
      available: true,
    },
    {
      id: "appointments",
      name: "Appointments",
      description: "Schedule appointments with municipal offices",
      icon: "calendar",
      category: "Services",
      available: true,
    },
    {
      id: "complaints",
      name: "Complaints & Feedback",
      description: "Submit complaints and community reports",
      icon: "alert-circle",
      category: "Services",
      available: true,
    },
    {
      id: "tracking",
      name: "Request Tracking",
      description: "Track submitted requests and documents",
      icon: "map-pin",
      category: "Services",
      available: true,
    },
    {
      id: "news",
      name: "News & Announcements",
      description: "Stay informed with municipal updates",
      icon: "rss",
      category: "Information",
      available: true,
    },
  ];

  return sendSuccess(res, {
    message: "Services catalog loaded",
    data: services,
  });
});
