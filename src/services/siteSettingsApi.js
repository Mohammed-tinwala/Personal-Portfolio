import api from "./api";

export const getSiteSettings = async () => {
  const response = await api.get("/site-settings");
  return response.data;
};

export const updateSiteSettings = async (data) => {
  const response = await api.put("/site-settings", data);
  return response.data;
};