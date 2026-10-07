import api from "./api";

export const getExperience = async () => {
  const response = await api.get("/experience");
  return response.data;
};

export const getAllExperience = async () => {
  const response = await api.get("/experience/all");
  return response.data;
};

export const createExperience = async (data) => {
  const response = await api.post("/experience", data);
  return response.data;
};

export const updateExperience = async (id, data) => {
  const response = await api.put(`/experience/${id}`, data);
  return response.data;
};

export const deleteExperience = async (id) => {
  const response = await api.delete(`/experience/${id}`);
  return response.data;
};
