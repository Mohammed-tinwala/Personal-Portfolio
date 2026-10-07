import api from "./api";

export const getHero = async () => {
  const response = await api.get("/hero");
  return response.data;
};

export const updateHero = async (data) => {
  const response = await api.put("/hero", data);
  return response.data;
};