'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useToast } from '@/components/Toast';
import { Calendar, Plus, Search, User, Briefcase, Clock, DollarSign, CheckCircle, XCircle, Edit, Trash2, AlertCircle } from 'lucide-react';
import { agendamentosApi } from '@/services/api';
import { Agendamento } from '@/types';

export default function AgendaPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [agendamentosFiltrados, setAgendamentosFiltrados] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<Agendamento | null>(null);
  const [mostrarModalDeletar, setMostrarModalDeletar] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  useEffect(() => {
    filtrarAgendamentos();
  }, [busca, filtroStatus, agendamentos]);

  const carregarAgendamentos = async () => {
    try {
      const response = await agendamentosApi.listar();
      setAgendamentos(response.data.data || []);
    } catch (error) {
      showToast('Erro ao carregar agendamentos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtrarAgendamentos = () => {
    let filtrados = [...agendamentos];

    // Filtrar por status
    if (filtroStatus !== 'todos') {
      filtrados = filtrados.filter(ag => ag.status === filtroStatus);
    }

    // Filtrar por busca
    if (busca.trim() !== '') {
      filtrados = filtrados.filter(ag =>
        ag.cliente?.nome.toLowerCase().includes(busca.toLowerCase()) ||
        ag.servico?.nome.toLowerCase().includes(busca.toLowerCase())
      );
    }

    // Ordenar por data (mais recentes primeiro)
    filtrados.sort((a, b) => {
      const dataA = new Date(a.dataHora).getTime();
      const dataB = new Date(b.dataHora).getTime();
      return dataB - dataA;
    });

    setAgendamentosFiltrados(filtrados);
  };

  const formatarData = (dataHora: string) => {
    const data = new Date(dataHora);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatarHora = (dataHora: string) => {
    const data = new Date(dataHora);
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarPreco = (preco?: number) => {
    if (!preco) return 'N/A';
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'concluido':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmado':
        return <CheckCircle className="w-4 h-4" />;
      case 'pendente':
        return <Clock className="w-4 h-4" />;
      case 'cancelado':
        return <XCircle className="w-4 h-4" />;
      case 'concluido':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'Confirmado';
      case 'pendente':
        return 'Pendente';
      case 'cancelado':
        return 'Cancelado';
      case 'concluido':
        return 'Concluído';
      default:
        return status;
    }
  };

  const handleMudarStatus = async (id: number, novoStatus: string) => {
    try {
      await agendamentosApi.atualizarStatus(id, novoStatus);
      showToast(`Agendamento ${getStatusLabel(novoStatus).toLowerCase()} com sucesso!`, 'success');
      carregarAgendamentos();
    } catch (error: any) {
      const mensagem = error.response?.data?.message || 'Erro ao atualizar status';
      showToast(mensagem, 'error');
    }
  };

  const handleEditar = (id: number) => {
    router.push(`/agenda/${id}/editar`);
  };

  const handleConfirmarDeletar = (agendamento: Agendamento) => {
    setAgendamentoSelecionado(agendamento);
    setMostrarModalDeletar(true);
  };

  const handleDeletar = async () => {
    if (!agendamentoSelecionado) return;

    try {
      await agendamentosApi.deletar(agendamentoSelecionado.id);
      showToast('Agendamento removido com sucesso!', 'success');
      setMostrarModalDeletar(false);
      carregarAgendamentos();
    } catch (error: any) {
      const mensagem = error.response?.data?.message || 'Erro ao remover agendamento';
      showToast(mensagem, 'error');
    }
  };

  const contarPorStatus = (status: string) => {
    return agendamentos.filter(ag => ag.status === status).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando agenda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary-500" />
            Minha Agenda
          </h1>
          <p className="text-gray-600 mt-1">
            Total: <span className="font-bold">{agendamentos.length}</span> agendamento(s)
          </p>
        </div>
        
        <Button
          variant="primary"
          size="large"
          icon={Plus}
          onClick={() => router.push('/agenda/novo')}
        >
          Novo Agendamento
        </Button>
      </div>

      {/* Cards de Resumo por Status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-yellow-50 border-2 border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-200 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-700">{contarPorStatus('pendente')}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-green-50 border-2 border-green-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-200 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold">Confirmados</p>
              <p className="text-2xl font-bold text-green-700">{contarPorStatus('confirmado')}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-blue-50 border-2 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-200 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold">Concluídos</p>
              <p className="text-2xl font-bold text-blue-700">{contarPorStatus('concluido')}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-red-50 border-2 border-red-200">
          <div className="flex items-center gap-3">
            <div className="bg-red-200 p-3 rounded-lg">
              <XCircle className="w-6 h-6 text-red-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold">Cancelados</p>
              <p className="text-2xl font-bold text-red-700">{contarPorStatus('cancelado')}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <div className="space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por cliente ou serviço..."
              className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary-300 focus:border-primary-500"
            />
          </div>

          {/* Filtro de Status */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroStatus('todos')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filtroStatus === 'todos'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({agendamentos.length})
            </button>
            <button
              onClick={() => setFiltroStatus('pendente')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filtroStatus === 'pendente'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pendentes ({contarPorStatus('pendente')})
            </button>
            <button
              onClick={() => setFiltroStatus('confirmado')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filtroStatus === 'confirmado'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Confirmados ({contarPorStatus('confirmado')})
            </button>
            <button
              onClick={() => setFiltroStatus('concluido')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filtroStatus === 'concluido'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Concluídos ({contarPorStatus('concluido')})
            </button>
            <button
              onClick={() => setFiltroStatus('cancelado')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filtroStatus === 'cancelado'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancelados ({contarPorStatus('cancelado')})
            </button>
          </div>

          {busca && (
            <p className="text-gray-600">
              Encontrados: <span className="font-bold">{agendamentosFiltrados.length}</span> resultado(s)
            </p>
          )}
        </div>
      </Card>

      {/* Lista de Agendamentos */}
      {agendamentosFiltrados.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {busca || filtroStatus !== 'todos' 
                ? 'Nenhum agendamento encontrado' 
                : 'Nenhum agendamento cadastrado'
              }
            </h3>
            <p className="text-gray-500 mb-6">
              {busca || filtroStatus !== 'todos'
                ? 'Tente ajustar os filtros de busca' 
                : 'Comece marcando seu primeiro horário'
              }
            </p>
            {!busca && filtroStatus === 'todos' && (
              <Button
                variant="primary"
                size="large"
                icon={Plus}
                onClick={() => router.push('/agenda/novo')}
              >
                Fazer Primeiro Agendamento
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {agendamentosFiltrados.map((agendamento) => (
            <Card key={agendamento.id} hover>
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Informações Principais */}
                <div className="flex-1 space-y-3">
                  {/* Data e Hora - DESTAQUE */}
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-100 px-4 py-2 rounded-lg">
                      <p className="text-xs font-semibold text-gray-600">Data</p>
                      <p className="text-lg font-bold text-primary-700">
                        {formatarData(agendamento.dataHora)}
                      </p>
                    </div>
                    <div className="bg-primary-100 px-4 py-2 rounded-lg">
                      <p className="text-xs font-semibold text-gray-600">Horário</p>
                      <p className="text-lg font-bold text-primary-700">
                        {formatarHora(agendamento.dataHora)}
                      </p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg border-2 flex items-center gap-2 ${getStatusColor(agendamento.status)}`}>
                      {getStatusIcon(agendamento.status)}
                      <span className="font-bold">{getStatusLabel(agendamento.status)}</span>
                    </div>
                  </div>

                  {/* Cliente e Serviço */}
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-600">Cliente</p>
                        <p className="text-base font-bold text-gray-800">
                          {agendamento.cliente?.nome || 'N/A'}
                        </p>
                        {agendamento.cliente?.telefone && (
                          <p className="text-sm text-gray-600">{agendamento.cliente.telefone}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Briefcase className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-600">Serviço</p>
                        <p className="text-base font-bold text-gray-800">
                          {agendamento.servico?.nome || 'N/A'}
                        </p>
                        <p className="text-lg font-bold text-success-600">
                          {formatarPreco(agendamento.servico?.preco)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Observações */}
                  {agendamento.observacoes && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Observações</p>
                      <p className="text-sm text-gray-700">{agendamento.observacoes}</p>
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="lg:w-48 space-y-2">
                  {/* Mudar Status */}
                  {agendamento.status === 'pendente' && (
                    <button
                      onClick={() => handleMudarStatus(agendamento.id, 'confirmado')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-semibold"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Confirmar
                    </button>
                  )}

                  {agendamento.status === 'confirmado' && (
                    <button
                      onClick={() => handleMudarStatus(agendamento.id, 'concluido')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Concluir
                    </button>
                  )}

                  {(agendamento.status === 'pendente' || agendamento.status === 'confirmado') && (
                    <button
                      onClick={() => handleMudarStatus(agendamento.id, 'cancelado')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-semibold"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancelar
                    </button>
                  )}

                  {/* Editar e Excluir */}
                  <button
                    onClick={() => handleEditar(agendamento.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-semibold"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>

                  <button
                    onClick={() => handleConfirmarDeletar(agendamento)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {mostrarModalDeletar && agendamentoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-danger-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Confirmar Exclusão
              </h2>
              
              <p className="text-gray-600 mb-4">
                Tem certeza que deseja excluir este agendamento?
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <p className="text-sm text-gray-600 mb-1">Cliente</p>
                <p className="font-bold text-gray-800 mb-3">
                  {agendamentoSelecionado.cliente?.nome}
                </p>
                
                <p className="text-sm text-gray-600 mb-1">Data e Hora</p>
                <p className="font-bold text-gray-800">
                  {formatarData(agendamentoSelecionado.dataHora)} às {formatarHora(agendamentoSelecionado.dataHora)}
                </p>
              </div>

              <p className="text-sm text-danger-600 font-semibold mb-6">
                ⚠️ Esta ação não pode ser desfeita!
              </p>

              <div className="flex gap-3">
                <Button
                  variant="danger"
                  fullWidth
                  icon={Trash2}
                  onClick={handleDeletar}
                >
                  Sim, Excluir
                </Button>
                
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setMostrarModalDeletar(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}