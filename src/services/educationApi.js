import api from "./api";

export const getEducation = async () => {
  const response = await api.get("/education");
  return response.data;
};

export const getAllEducation = async () => {
  const response = await api.get("/education/all");
  return response.data;
};

export const createEducation = async (data) => {
  const response = await api.post("/education", data);
  return response.data;
};

export const updateEducation = async (id, data) => {
  const response = await api.put(`/education/${id}`, data);
  return response.data;
};

export const deleteEducation = async (id) => {
  const response = await api.delete(`/education/${id}`);
  return response.data;
};
