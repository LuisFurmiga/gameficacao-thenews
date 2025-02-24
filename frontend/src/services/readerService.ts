// frontend/src/services/readerService.ts

import api from "./api";

export const getReaderStats = async (email: string) => {
  try {
    const response = await api.get(`/reader/stats?email=${email}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estatísticas do leitor:", error);
    throw error;
  }
};

export const loginReader = async (email: string) => {
  try {
    const response = await api.post(`/reader/login`, { email });
    return response.data; // Retorna o token JWT
  } catch (error) {
    console.error("Erro ao fazer login do leitor:", error);
    throw error;
  }
};
