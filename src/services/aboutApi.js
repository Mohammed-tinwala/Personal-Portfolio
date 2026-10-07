import api from "./api";

export const getAbout = async () => {
  const response = await api.get("/about");
  return response.data;
};

export const updateAbout = async (data) => {
  const response = await api.put("/about", data);
  return response.data;
};
