// frontend/src/services/newsletterService.ts

// AINDA NÃO USADO

import api from "./api";

export const getNewsletterById = async (id: string) => {
  try {
    const response = await api.get(`/newsletter/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar newsletter:", error);
    throw error;
  }
};

export const getAllNewsletters = async () => {
  try {
    const response = await api.get(`/newsletter`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar todas as newsletters:", error);
    throw error;
  }
};
