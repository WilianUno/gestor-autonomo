import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Erro ao conectar com o servidor';
    console.error('Erro na API:', message);
    return Promise.reject(error);
  }
);

export const clientesApi = {
  listar: () => api.get('/clientes'),
  buscarPorId: (id: number) => api.get(`/clientes/${id}`),
  buscarPorNome: (termo: string) => api.get(`/clientes/search?termo=${termo}`),
  criar: (data: any) => api.post('/clientes', data),
  atualizar: (id: number, data: any) => api.put(`/clientes/${id}`, data),
  deletar: (id: number) => api.delete(`/clientes/${id}`),
  estatisticas: () => api.get('/clientes/estatisticas'),
};

export const servicosApi = {
  listar: () => api.get('/servicos'),
  buscarPorId: (id: number) => api.get(`/servicos/${id}`),
  buscarPorNome: (termo: string) => api.get(`/servicos/search?termo=${termo}`),
  criar: (data: any) => api.post('/servicos', data),
  atualizar: (id: number, data: any) => api.put(`/servicos/${id}`, data),
  deletar: (id: number) => api.delete(`/servicos/${id}`),
  estatisticas: () => api.get('/servicos/estatisticas'),
};

export const agendamentosApi = {
  listar: () => api.get('/agendamentos'),
  buscarPorId: (id: number) => api.get(`/agendamentos/${id}`),
  buscarPorCliente: (clienteId: number) => api.get(`/agendamentos/cliente/${clienteId}`),
  buscarPorStatus: (status: string) => api.get(`/agendamentos/status/${status}`),
  buscarPorPeriodo: (inicio: string, fim: string) => 
    api.get(`/agendamentos/periodo?inicio=${inicio}&fim=${fim}`),
  criar: (data: any) => api.post('/agendamentos', data),
  atualizar: (id: number, data: any) => api.put(`/agendamentos/${id}`, data),
  cancelar: (id: number) => api.patch(`/agendamentos/${id}/cancelar`),
  deletar: (id: number) => api.delete(`/agendamentos/${id}`),
  estatisticas: () => api.get('/agendamentos/estatisticas'),
};

export default api;