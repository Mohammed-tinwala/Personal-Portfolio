import api from "./api";

export const getSkills = async () => {
  const response = await api.get("/skills");
  return response.data;
};

export const getAllSkills = async () => {
  const response = await api.get("/skills/all");
  return response.data;
};

export const createSkill = async (data) => {
  const response = await api.post("/skills", data);
  return response.data;
};

export const updateSkill = async (id, data) => {
  const response = await api.put(`/skills/${id}`, data);
  return response.data;
};

export const deleteSkill = async (id) => {
  const response = await api.delete(`/skills/${id}`);
  return response.data;
};
