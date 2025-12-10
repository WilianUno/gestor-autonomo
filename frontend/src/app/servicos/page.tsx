'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useToast } from '@/components/Toast';
import { Briefcase, Plus, Search, DollarSign, Clock, Edit, Trash2, Eye } from 'lucide-react';
import { servicosApi } from '@/services/api';
import { Servico } from '@/types';

export default function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [servicosFiltrados, setServicosFiltrados] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalDeletar, setMostrarModalDeletar] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    carregarServicos();
  }, []);

  useEffect(() => {
    // Filtrar serviços quando busca mudar
    if (busca.trim() === '') {
      setServicosFiltrados(servicos);
    } else {
      const filtrados = servicos.filter(servico =>
        servico.nome.toLowerCase().includes(busca.toLowerCase()) ||
        (servico.descricao && servico.descricao.toLowerCase().includes(busca.toLowerCase()))
      );
      setServicosFiltrados(filtrados);
    }
  }, [busca, servicos]);

  const carregarServicos = async () => {
    try {
      const response = await servicosApi.listar();
      setServicos(response.data.data || []);
      setServicosFiltrados(response.data.data || []);
    } catch (error) {
      showToast('Erro ao carregar serviços', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatarPreco = (preco: number) => {
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatarDuracao = (minutos?: number) => {
    if (!minutos) return 'Não definida';
    if (minutos < 60) return `${minutos} min`;
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
  };

  const handleVerDetalhes = (servico: Servico) => {
    setServicoSelecionado(servico);
    setMostrarModal(true);
  };

  const handleEditar = (id: number) => {
    router.push(`/servicos/${id}/editar`);
  };

  const handleConfirmarDeletar = (servico: Servico) => {
    setServicoSelecionado(servico);
    setMostrarModalDeletar(true);
  };

  const handleDeletar = async () => {
    if (!servicoSelecionado) return;

    try {
      await servicosApi.deletar(servicoSelecionado.id);
      showToast('Serviço removido com sucesso!', 'success');
      setMostrarModalDeletar(false);
      carregarServicos();
    } catch (error: any) {
      const mensagem = error.response?.data?.message || 'Erro ao remover serviço';
      showToast(mensagem, 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-success-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando serviços...</p>
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
            <Briefcase className="w-8 h-8 text-success-500" />
            Meus Serviços
          </h1>
          <p className="text-gray-600 mt-1">
            Total: <span className="font-bold">{servicos.length}</span> serviço(s)
          </p>
        </div>
        
        <Button
          variant="success"
          size="large"
          icon={Plus}
          onClick={() => router.push('/servicos/novo')}
        >
          Cadastrar Novo Serviço
        </Button>
      </div>

      {/* Busca */}
      <Card>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome ou descrição..."
            className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-success-300 focus:border-success-500"
          />
        </div>
        {busca && (
          <p className="mt-3 text-gray-600">
            Encontrados: <span className="font-bold">{servicosFiltrados.length}</span> resultado(s)
          </p>
        )}
      </Card>

      {/* Lista de Serviços */}
      {servicosFiltrados.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {busca ? 'Nenhum serviço encontrado' : 'Nenhum serviço cadastrado'}
            </h3>
            <p className="text-gray-500 mb-6">
              {busca 
                ? 'Tente buscar por outro nome' 
                : 'Comece cadastrando os serviços que você oferece'
              }
            </p>
            {!busca && (
              <Button
                variant="success"
                size="large"
                icon={Plus}
                onClick={() => router.push('/servicos/novo')}
              >
                Cadastrar Primeiro Serviço
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicosFiltrados.map((servico) => (
            <Card key={servico.id} hover className="relative">
              {/* Nome do Serviço */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {servico.nome}
                </h3>
                {servico.descricao && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {servico.descricao}
                  </p>
                )}
              </div>

              {/* Preço e Duração - DESTAQUE */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-green-50 p-3 rounded-lg border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-success-600" />
                    <span className="text-xs font-semibold text-gray-600">Preço</span>
                  </div>
                  <p className="text-xl font-bold text-success-700">
                    {formatarPreco(servico.preco)}
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-primary-600" />
                    <span className="text-xs font-semibold text-gray-600">Duração</span>
                  </div>
                  <p className="text-sm font-bold text-primary-700">
                    {formatarDuracao(servico.duracao)}
                  </p>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleVerDetalhes(servico)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-semibold text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Ver
                </button>
                
                <button
                  onClick={() => handleEditar(servico.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-success-100 text-success-700 rounded-lg hover:bg-success-200 transition-colors font-semibold text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                
                <button
                  onClick={() => handleConfirmarDeletar(servico)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-danger-100 text-danger-700 rounded-lg hover:bg-danger-200 transition-colors font-semibold text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Detalhes */}
      {mostrarModal && servicoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-success-500" />
                Detalhes do Serviço
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Nome</label>
                  <p className="text-lg text-gray-800">{servicoSelecionado.nome}</p>
                </div>

                {servicoSelecionado.descricao && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Descrição</label>
                    <p className="text-lg text-gray-800">{servicoSelecionado.descricao}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Preço</label>
                    <p className="text-2xl font-bold text-success-600">
                      {formatarPreco(servicoSelecionado.preco)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Duração</label>
                    <p className="text-xl font-bold text-primary-600">
                      {formatarDuracao(servicoSelecionado.duracao)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="success"
                  fullWidth
                  icon={Edit}
                  onClick={() => {
                    setMostrarModal(false);
                    handleEditar(servicoSelecionado.id);
                  }}
                >
                  Editar Serviço
                </Button>
                
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setMostrarModal(false)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {mostrarModalDeletar && servicoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-danger-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Confirmar Exclusão
              </h2>
              
              <p className="text-gray-600 mb-2">
                Tem certeza que deseja excluir o serviço:
              </p>
              
              <p className="text-lg font-bold text-gray-800 mb-1">
                {servicoSelecionado.nome}
              </p>
              
              <p className="text-xl font-bold text-success-600 mb-6">
                {formatarPreco(servicoSelecionado.preco)}
              </p>

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