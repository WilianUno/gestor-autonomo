'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useToast } from '@/components/Toast';
import { Users, Plus, Search, Phone, Mail, MapPin, Edit, Trash2, Eye } from 'lucide-react';
import { clientesApi } from '@/services/api';
import { Cliente } from '@/types';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalDeletar, setMostrarModalDeletar] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    carregarClientes();
  }, []);

  useEffect(() => {
    // Filtrar clientes quando busca mudar
    if (busca.trim() === '') {
      setClientesFiltrados(clientes);
    } else {
      const filtrados = clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
        cliente.telefone.includes(busca)
      );
      setClientesFiltrados(filtrados);
    }
  }, [busca, clientes]);

  const carregarClientes = async () => {
    try {
      const response = await clientesApi.listar();
      setClientes(response.data.data || []);
      setClientesFiltrados(response.data.data || []);
    } catch (error) {
      showToast('Erro ao carregar clientes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalhes = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setMostrarModal(true);
  };

  const handleEditar = (id: number) => {
    router.push(`/clientes/${id}/editar`);
  };

  const handleConfirmarDeletar = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setMostrarModalDeletar(true);
  };

  const handleDeletar = async () => {
    if (!clienteSelecionado) return;

    try {
      await clientesApi.deletar(clienteSelecionado.id);
      showToast('Cliente removido com sucesso!', 'success');
      setMostrarModalDeletar(false);
      carregarClientes();
    } catch (error) {
      showToast('Erro ao remover cliente', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando clientes...</p>
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
            <Users className="w-8 h-8 text-primary-500" />
            Meus Clientes
          </h1>
          <p className="text-gray-600 mt-1">
            Total: <span className="font-bold">{clientes.length}</span> cliente(s)
          </p>
        </div>
        
        <Button
          variant="success"
          size="large"
          icon={Plus}
          onClick={() => router.push('/clientes/novo')}
        >
          Cadastrar Novo Cliente
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
            placeholder="Buscar por nome ou telefone..."
            className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary-300 focus:border-primary-500"
          />
        </div>
        {busca && (
          <p className="mt-3 text-gray-600">
            Encontrados: <span className="font-bold">{clientesFiltrados.length}</span> resultado(s)
          </p>
        )}
      </Card>

      {/* Lista de Clientes */}
      {clientesFiltrados.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {busca ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            </h3>
            <p className="text-gray-500 mb-6">
              {busca 
                ? 'Tente buscar por outro nome ou telefone' 
                : 'Comece cadastrando seu primeiro cliente'
              }
            </p>
            {!busca && (
              <Button
                variant="primary"
                size="large"
                icon={Plus}
                onClick={() => router.push('/clientes/novo')}
              >
                Cadastrar Primeiro Cliente
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientesFiltrados.map((cliente) => (
            <Card key={cliente.id} hover className="relative">
              {/* Nome do Cliente */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {cliente.nome}
                </h3>
              </div>

              {/* Informações */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 text-primary-500" />
                  <span className="text-sm">{cliente.telefone}</span>
                </div>
                
                {cliente.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-primary-500" />
                    <span className="text-sm">{cliente.email}</span>
                  </div>
                )}
                
                {cliente.endereco && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    <span className="text-sm">{cliente.endereco}</span>
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleVerDetalhes(cliente)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-semibold text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Ver
                </button>
                
                <button
                  onClick={() => handleEditar(cliente.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-success-100 text-success-700 rounded-lg hover:bg-success-200 transition-colors font-semibold text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                
                <button
                  onClick={() => handleConfirmarDeletar(cliente)}
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
      {mostrarModal && clienteSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-primary-500" />
                Detalhes do Cliente
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Nome</label>
                  <p className="text-lg text-gray-800">{clienteSelecionado.nome}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Telefone</label>
                  <p className="text-lg text-gray-800">{clienteSelecionado.telefone}</p>
                </div>

                {clienteSelecionado.email && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">E-mail</label>
                    <p className="text-lg text-gray-800">{clienteSelecionado.email}</p>
                  </div>
                )}

                {clienteSelecionado.endereco && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Endereço</label>
                    <p className="text-lg text-gray-800">{clienteSelecionado.endereco}</p>
                  </div>
                )}

                {clienteSelecionado.observacoes && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Observações</label>
                    <p className="text-lg text-gray-800">{clienteSelecionado.observacoes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="success"
                  fullWidth
                  icon={Edit}
                  onClick={() => {
                    setMostrarModal(false);
                    handleEditar(clienteSelecionado.id);
                  }}
                >
                  Editar Cliente
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
      {mostrarModalDeletar && clienteSelecionado && (
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
                Tem certeza que deseja excluir o cliente:
              </p>
              
              <p className="text-lg font-bold text-gray-800 mb-6">
                {clienteSelecionado.nome}?
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