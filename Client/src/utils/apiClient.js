import axios from "axios";

// Centralized API Base URL fallback
const DEFAULT_AZURE_URL =
  "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net";

export const getApiBaseUrl = () => {
  const envUrl = import.meta.env?.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim() !== "") {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return DEFAULT_AZURE_URL;
};

export const getApiUrl = (endpoint) => {
  if (!endpoint) return getApiBaseUrl();
  // If endpoint is already a full URL (http:// or https://), return as is
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${getApiBaseUrl()}${cleanEndpoint}`;
};

export const fetchApiData = async (endpoint, options = {}) => {
  const targetUrl = getApiUrl(endpoint);
  return await axios.get(targetUrl, options);
};

export const sendApiData = async (endpoint, data = {}, method = "post", options = {}) => {
  const targetUrl = getApiUrl(endpoint);
  const normalizedMethod = method.toLowerCase();
  
  if (normalizedMethod === "put") {
    return await axios.put(targetUrl, data, options);
  } else if (normalizedMethod === "delete") {
    return await axios.delete(targetUrl, options);
  } else {
    return await axios.post(targetUrl, data, options);
  }
};

export const extractArrayData = (responseData) => {
  if (!responseData) return [];
  if (Array.isArray(responseData)) return responseData;
  if (responseData.data && Array.isArray(responseData.data)) {
    return responseData.data;
  }
  if (responseData.candidates && Array.isArray(responseData.candidates)) {
    return responseData.candidates;
  }
  if (responseData.result && Array.isArray(responseData.result)) {
    return responseData.result;
  }
  return [];
};
