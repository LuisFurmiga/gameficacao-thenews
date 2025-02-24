// frontend/src/services/adminServices.ts

import api from "./api";

export const getAdminDashboardStats = async () => {
  try {
    const response = await api.get(`/admin/metrics`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard administrativo:", error);
    throw error;
  }
};

export const getTopReaders = async () => {
  try {
    const response = await api.get(`/admin/top-readers`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar ranking dos leitores mais engajados:", error);
    throw error;
  }
};
