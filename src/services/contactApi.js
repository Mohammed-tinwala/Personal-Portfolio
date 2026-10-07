import api from "./api";

export const sendContactMessage = async (data) => {
  const response = await api.post("/contact", data);
  return response.data;
};

export const getContactMessages = async () => {
  const response = await api.get("/contact");
  return response.data;
};

export const markContactMessageAsRead = async (id) => {
  const response = await api.put(`/contact/${id}/read`);
  return response.data;
};

export const markContactMessageAsUnread = async (id) => {
  const response = await api.put(`/contact/${id}/unread`);
  return response.data;
};

export const deleteContactMessage = async (id) => {
  const response = await api.delete(`/contact/${id}`);
  return response.data;
};
