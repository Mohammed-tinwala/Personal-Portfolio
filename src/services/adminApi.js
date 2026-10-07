import api from "./api";

export const loginAdmin = async (credentials) => {
  const response = await api.post("/admin/login", credentials);
  return response.data;
};

export const getCurrentAdmin = async () => {
  const response = await api.get("/admin/me");
  return response.data;
};

export const logoutAdmin = async () => {
  const response = await api.post("/admin/logout");
  return response.data;
};