'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useToast } from '@/components/Toast';
import { Calendar, ArrowLeft, User, Briefcase, Clock, FileText, AlertCircle } from 'lucide-react';
import { agendamentosApi, clientesApi, servicosApi } from '@/services/api';
import { Cliente, Servico } from '@/types';

export default function NovoAgendamentoPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [formData, setFormData] = useState({
    clienteId: '',
    servicoId: '',
    data: '',
    hora: '',
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
      const [clientesRes, servicosRes] = await Promise.all([
        clientesApi.listar(),
        servicosApi.listar()
      ]);
      
      setClientes(clientesRes.data.data || []);
      setServicos(servicosRes.data.data || []);
    } catch (error) {
      showToast('Erro ao carregar dados', 'error');
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
    validarCampo(campo, valor);
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
      const servico = servicos.find(s => s.id === parseInt(formData.servicoId));

      await agendamentosApi.criar({
        clienteId: parseInt(formData.clienteId),
        servicoId: parseInt(formData.servicoId),
        dataHora,
        valor: servico?.preco || 0,
        ...(formData.observacoes && { observacoes: formData.observacoes })
      });

      showToast('Agendamento criado com sucesso! 🎉', 'success');
      router.push('/agenda');
    } catch (error: any) {
      const mensagem = error.response?.data?.message || 'Erro ao criar agendamento';
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
            Novo Agendamento
          </h1>
          <p className="text-gray-600 mt-1">Preencha os dados para criar um novo horário</p>
        </div>
      </div>

      {/* Avisos */}
      {clientes.length === 0 && (
        <Card className="bg-yellow-50 border-2 border-yellow-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-yellow-800 mb-1">
                Nenhum cliente cadastrado
              </p>
              <p className="text-yellow-700 mb-3">
                Você precisa cadastrar pelo menos um cliente antes de criar agendamentos.
              </p>
              <Button
                variant="secondary"
                size="small"
                onClick={() => router.push('/clientes/novo')}
              >
                Cadastrar Cliente
              </Button>
            </div>
          </div>
        </Card>
      )}

      {servicos.length === 0 && (
        <Card className="bg-yellow-50 border-2 border-yellow-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-yellow-800 mb-1">
                Nenhum serviço cadastrado
              </p>
              <p className="text-yellow-700 mb-3">
                Você precisa cadastrar pelo menos um serviço antes de criar agendamentos.
              </p>
              <Button
                variant="secondary"
                size="small"
                onClick={() => router.push('/servicos/novo')}
              >
                Cadastrar Serviço
              </Button>
            </div>
          </div>
        </Card>
      )}

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
              disabled={clientes.length === 0}
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:ring-4 ${
                errors.clienteId
                  ? 'border-danger-500 focus:ring-danger-300 focus:border-danger-500'
                  : 'border-gray-300 focus:ring-primary-300 focus:border-primary-500'
              } ${clientes.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
              disabled={servicos.length === 0}
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:ring-4 ${
                errors.servicoId
                  ? 'border-danger-500 focus:ring-danger-300 focus:border-danger-500'
                  : 'border-gray-300 focus:ring-success-300 focus:border-success-500'
              } ${servicos.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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

            {/* Detalhes do Serviço Selecionado */}
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
                min={new Date().toISOString().split('T')[0]}
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

        {/* Dica */}
        <Card className="bg-blue-50 border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="text-blue-800">
              <p className="font-semibold mb-1">💡 Dica:</p>
              <p className="text-sm">
                Após criar o agendamento, você pode confirmar, cancelar ou concluir diretamente na agenda.
              </p>
            </div>
          </div>
        </Card>

        {/* Botões */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            icon={Calendar}
            disabled={salvando || clientes.length === 0 || servicos.length === 0}
          >
            {salvando ? 'Criando...' : 'Criar Agendamento'}
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