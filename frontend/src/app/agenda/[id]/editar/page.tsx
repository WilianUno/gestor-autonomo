'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useToast } from '@/components/Toast';
import { Calendar, ArrowLeft, User, Briefcase, Clock, FileText, AlertCircle, Save } from 'lucide-react';
import { agendamentosApi, clientesApi, servicosApi } from '@/services/api';
import { Cliente, Servico, Agendamento } from '@/types';

export default function EditarAgendamentoPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const id = parseInt(params.id as string);

  const [agendamento, setAgendamento] = useState<Agendamento | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [formData, setFormData] = useState({
    clienteId: '',
    servicoId: '',
    data: '',
    hora: '',
    status: '',
    observacoes: ''
  });

  const [errors, setErrors] = useState({
    clienteId: '',
    servicoId: '',
    data: '',
    hora: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [agendamentoRes, clientesRes, servicosRes] = await Promise.all([
        agendamentosApi.buscarPorId(id),
        clientesApi.listar(),
        servicosApi.listar()
      ]);

      const agendamentoData = agendamentoRes.data.data;
      setAgendamento(agendamentoData);
      setClientes(clientesRes.data.data || []);
      setServicos(servicosRes.data.data || []);

      // Preencher formulário
      const dataHora = new Date(agendamentoData.dataHora);
      const data = dataHora.toISOString().split('T')[0];
      const hora = dataHora.toTimeString().slice(0, 5);

      setFormData({
        clienteId: agendamentoData.clienteId.toString(),
        servicoId: agendamentoData.servicoId.toString(),
        data,
        hora,
        status: agendamentoData.status,
        observacoes: agendamentoData.observacoes || ''
      });
    } catch (error) {
      showToast('Erro ao carregar agendamento', 'error');
      router.push('/agenda');
    } finally {
      setLoading(false);
    }
  };

  const validarCampo = (campo: string, valor: string) => {
    let erro = '';

    switch (campo) {
      case 'clienteId':
        if (!valor) erro = 'Selecione um cliente';
        break;
      case 'servicoId':
        if (!valor) erro = 'Selecione um serviço';
        break;
      case 'data':
        if (!valor) erro = 'Informe a data';
        break;
      case 'hora':
        if (!valor) erro = 'Informe o horário';
        break;
    }

    setErrors(prev => ({ ...prev, [campo]: erro }));
    return erro === '';
  };

  const handleChange = (campo: string, valor: string) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    if (campo in errors) {
      validarCampo(campo, valor);
    }
  };

  const validarFormulario = () => {
    const camposObrigatorios = ['clienteId', 'servicoId', 'data', 'hora'];
    let formularioValido = true;

    camposObrigatorios.forEach(campo => {
      const valor = formData[campo as keyof typeof formData];
      if (!validarCampo(campo, valor)) {
        formularioValido = false;
      }
    });

    return formularioValido;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      showToast('Por favor, preencha todos os campos obrigatórios', 'error');
      return;
    }

    setSalvando(true);

    try {
      const dataHora = `${formData.data}T${formData.hora}:00`;

      await agendamentosApi.atualizar(id, {
        clienteId: parseInt(formData.clienteId),
        servicoId: parseInt(formData.servicoId),
        dataHora,
        status: formData.status,
        observacoes: formData.observacoes || undefined
      });

      showToast('Agendamento atualizado com sucesso! ✅', 'success');
      router.push('/agenda');
    } catch (error: any) {
      const mensagem = error.response?.data?.message || 'Erro ao atualizar agendamento';
      showToast(mensagem, 'error');
    } finally {
      setSalvando(false);
    }
  };

  const getServicoSelecionado = () => {
    if (!formData.servicoId) return null;
    return servicos.find(s => s.id === parseInt(formData.servicoId));
  };

  const formatarPreco = (preco?: number) => {
    if (!preco) return 'N/A';
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatarDuracao = (minutos?: number) => {
    if (!minutos) return 'Não definida';
    if (minutos < 60) return `${minutos} min`;
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
  };

  const formatarDataCriacao = (data?: string) => {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  const servicoSelecionado = getServicoSelecionado();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          icon={ArrowLeft}
          onClick={() => router.push('/agenda')}
        >
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary-500" />
            Editar Agendamento
          </h1>
          <p className="text-gray-600 mt-1">
            Criado em: {formatarDataCriacao(agendamento?.createdAt)}
          </p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seleção de Cliente */}
        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-500" />
            Selecionar Cliente *
          </h2>
          
          <div className="space-y-3">
            <select
              value={formData.clienteId}
              onChange={(e) => handleChange('clienteId', e.target.value)}
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:ring-4 ${
                errors.clienteId
                  ? 'border-danger-500 focus:ring-danger-300 focus:border-danger-500'
                  : 'border-gray-300 focus:ring-primary-300 focus:border-primary-500'
              }`}
            >
              <option value="">-- Selecione um cliente --</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome} {cliente.telefone ? `- ${cliente.telefone}` : ''}
                </option>
              ))}
            </select>

            {errors.clienteId && (
              <p className="text-danger-600 text-sm font-semibold flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.clienteId}
              </p>
            )}
          </div>
        </Card>

        {/* Seleção de Serviço */}
        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-success-500" />
            Selecionar Serviço *
          </h2>
          
          <div className="space-y-3">
            <select
              value={formData.servicoId}
              onChange={(e) => handleChange('servicoId', e.target.value)}
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:ring-4 ${
                errors.servicoId
                  ? 'border-danger-500 focus:ring-danger-300 focus:border-danger-500'
                  : 'border-gray-300 focus:ring-success-300 focus:border-success-500'
              }`}
            >
              <option value="">-- Selecione um serviço --</option>
              {servicos.map(servico => (
                <option key={servico.id} value={servico.id}>
                  {servico.nome} - {formatarPreco(servico.preco)}
                </option>
              ))}
            </select>

            {errors.servicoId && (
              <p className="text-danger-600 text-sm font-semibold flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.servicoId}
              </p>
            )}

            {servicoSelecionado && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mt-3">
                <p className="text-sm font-semibold text-gray-600 mb-2">Detalhes do serviço:</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-600">Preço</p>
                    <p className="text-lg font-bold text-success-700">
                      {formatarPreco(servicoSelecionado.preco)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Duração</p>
                    <p className="text-lg font-bold text-primary-700">
                      {formatarDuracao(servicoSelecionado.duracao)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Data e Hora */}
        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-500" />
            Data e Horário *
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Data
              </label>
              <input
                type="date"
                value={formData.data}
                onChange={(e) => handleChange('data', e.target.value)}
                className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:ring-4 ${
                  errors.data
                    ? 'border-danger-500 focus:ring-danger-300 focus:border-danger-500'
                    : 'border-gray-300 focus:ring-primary-300 focus:border-primary-500'
                }`}
              />
              {errors.data && (
                <p className="text-danger-600 text-sm font-semibold flex items-center gap-1 mt-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.data}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Horário
              </label>
              <input
                type="time"
                value={formData.hora}
                onChange={(e) => handleChange('hora', e.target.value)}
                className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:ring-4 ${
                  errors.hora
                    ? 'border-danger-500 focus:ring-danger-300 focus:border-danger-500'
                    : 'border-gray-300 focus:ring-primary-300 focus:border-primary-500'
                }`}
              />
              {errors.hora && (
                <p className="text-danger-600 text-sm font-semibold flex items-center gap-1 mt-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.hora}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Status */}
        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-gray-500" />
            Status do Agendamento
          </h2>
          
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-300 focus:border-gray-500"
          >
            <option value="pendente">⏳ Pendente</option>
            <option value="confirmado">✅ Confirmado</option>
            <option value="concluido">🎉 Concluído</option>
            <option value="cancelado">❌ Cancelado</option>
          </select>
        </Card>

        {/* Observações */}
        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-500" />
            Observações (opcional)
          </h2>
          
          <textarea
            value={formData.observacoes}
            onChange={(e) => handleChange('observacoes', e.target.value)}
            placeholder="Ex: Cliente prefere atendimento pela manhã, pagamento em dinheiro..."
            rows={4}
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-300 focus:border-gray-500 resize-none"
          />
        </Card>

        {/* Botões */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            icon={Save}
            disabled={salvando}
          >
            {salvando ? 'Salvando...' : 'Salvar Alterações'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="large"
            onClick={() => router.push('/agenda')}
            disabled={salvando}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}