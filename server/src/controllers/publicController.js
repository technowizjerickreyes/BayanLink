import asyncHandler from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { listVisibleNews } from "../services/newsFeedService.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "../../data");

// Load JSON data files
function loadJsonFile(filename) {
  try {
    const filePath = path.join(dataDir, filename);
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return [];
  }
}

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
    barangays: 26,
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
 * Get list of municipalities from JSON data
 */
export const getMunicipalityList = asyncHandler(async (_req, res) => {
  const municipalities = loadJsonFile("municipalities.json");

  return sendSuccess(res, {
    message: "Municipalities loaded",
    data: municipalities,
  });
});

/**
 * GET /api/public/barangays
 * Get list of barangays from JSON data
 */
export const getBarangaysList = asyncHandler(async (_req, res) => {
  const barangays = loadJsonFile("barangays.json");

  return sendSuccess(res, {
    message: "Barangays loaded",
    data: barangays,
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
