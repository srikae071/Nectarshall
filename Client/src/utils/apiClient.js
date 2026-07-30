import axios from "axios";

const LOCAL_BASE = "http://localhost:5000";
const AZURE_BASE = "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net";

export const extractArrayData = (resData) => {
  if (!resData) return [];
  if (Array.isArray(resData)) return resData;
  if (Array.isArray(resData.data)) return resData.data;
  if (Array.isArray(resData.candidates)) return resData.candidates;
  if (Array.isArray(resData.employees)) return resData.employees;
  if (Array.isArray(resData.result)) return resData.result;
  return [];
};

/**
 * Localhost 5000 Primary Data Fetcher
 */
export const fetchApiData = async (path, options = {}) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const localUrl = `${LOCAL_BASE}${cleanPath}`;
  const proxyUrl = cleanPath;
  const azureUrl = `${AZURE_BASE}${cleanPath}`;

  // 1. Try Localhost 5000 Backend FIRST
  try {
    const res = await axios.get(localUrl, { timeout: 3000, ...options });
    if (res && res.status < 400 && res.data) {
      return res;
    }
  } catch (e1) {
    try {
      const res = await axios.get(proxyUrl, { timeout: 3000, ...options });
      if (res && res.status < 400 && res.data) {
        return res;
      }
    } catch (e2) {}
  }

  // 2. Fallback to Azure if local backend is un-contactable
  try {
    const res = await axios.get(azureUrl, { timeout: 3000, ...options });
    if (res && res.status < 400) {
      return res;
    }
  } catch (e3) {}

  return await axios.get(localUrl, options);
};

export const sendApiData = async (method, path, body, options = {}) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const localUrl = `${LOCAL_BASE}${cleanPath}`;
  const proxyUrl = cleanPath;
  const azureUrl = `${AZURE_BASE}${cleanPath}`;

  // 1. Send to Localhost 5000 Backend FIRST
  try {
    return await axios({ method, url: localUrl, data: body, timeout: 4000, ...options });
  } catch (e1) {
    try {
      return await axios({ method, url: proxyUrl, data: body, timeout: 4000, ...options });
    } catch (e2) {
      return await axios({ method, url: azureUrl, data: body, timeout: 4000, ...options });
    }
  }
};
