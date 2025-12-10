'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useToast } from '@/components/Toast';
import { Edit, ArrowLeft, Save } from 'lucide-react';
import { clientesApi } from '@/services/api';
import { Cliente } from '@/types';

export default function EditarClientePage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cliente, setCliente] = useState<Cliente | null>(null);

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    endereco: '',
    observacoes: '',
  });

  // Estado de erros
  const [errors, setErrors] = useState({
    nome: '',
    telefone: '',
  });

  useEffect(() => {
    carregarCliente();
  }, []);

  const carregarCliente = async () => {
    try {
      const id = Number(params.id);
      const response = await clientesApi.buscarPorId(id);
      const clienteData = response.data.data;
      
      setCliente(clienteData);
      setFormData({
        nome: clienteData.nome || '',
        telefone: clienteData.telefone || '',
        email: clienteData.email || '',
        endereco: clienteData.endereco || '',
        observacoes: clienteData.observacoes || '',
      });
    } catch (error) {
      showToast('Erro ao carregar cliente', 'error');
      router.push('/clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro ao digitar
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validarFormulario = (): boolean => {
    const novosErros = {
      nome: '',
      telefone: '',
    };

    let valido = true;

    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
      valido = false;
    }

    if (!formData.telefone.trim()) {
      novosErros.telefone = 'Telefone é obrigatório';
      valido = false;
    }

    setErrors(novosErros);
    return valido;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      showToast('Por favor, preencha os campos obrigatórios', 'error');
      return;
    }

    setSaving(true);

    try {
      const id = Number(params.id);
      await clientesApi.atualizar(id, formData);
      showToast('Cliente atualizado com sucesso! ✅', 'success');
      router.push('/clientes');
    } catch (error: any) {
      const mensagem = error.response?.data?.message || 'Erro ao atualizar cliente';
      showToast(mensagem, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando dados do cliente...</p>
        </div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Cliente não encontrado</h2>
        <Button variant="primary" icon={ArrowLeft} onClick={() => router.push('/clientes')}>
          Voltar para Clientes
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          icon={ArrowLeft}
          onClick={() => router.back()}
        >
          Voltar
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Edit className="w-8 h-8 text-primary-500" />
            Editar Cliente
          </h1>
          <p className="text-gray-600 mt-1">
            Atualize as informações de <span className="font-semibold">{cliente.nome}</span>
          </p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit}>
        <Card>
          <div className="space-y-6">
            {/* Nome */}
            <Input
              label="Nome Completo"
              value={formData.nome}
              onChange={(value) => handleChange('nome', value)}
              placeholder="Ex: João Silva"
              required
              error={errors.nome}
            />

            {/* Telefone */}
            <Input
              label="Telefone"
              type="tel"
              value={formData.telefone}
              onChange={(value) => handleChange('telefone', value)}
              placeholder="Ex: (49) 99999-1111"
              required
              error={errors.telefone}
            />

            {/* Email */}
            <Input
              label="E-mail (opcional)"
              type="email"
              value={formData.email}
              onChange={(value) => handleChange('email', value)}
              placeholder="Ex: joao@email.com"
            />

            {/* Endereço */}
            <Input
              label="Endereço (opcional)"
              value={formData.endereco}
              onChange={(value) => handleChange('endereco', value)}
              placeholder="Ex: Rua A, 123 - Centro"
            />

            {/* Observações */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Observações (opcional)
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => handleChange('observacoes', e.target.value)}
                placeholder="Ex: Cliente prefere atendimento pela manhã"
                rows={4}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary-300 focus:border-primary-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              size="large"
              fullWidth
              onClick={() => router.back()}
              disabled={saving}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="success"
              size="large"
              icon={Save}
              fullWidth
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </Card>
      </form>

      {/* Informação de cadastro */}
      <Card className="bg-gray-50">
        <div className="text-sm text-gray-600">
          <p><span className="font-semibold">Cadastrado em:</span> {new Date(cliente.createdAt || '').toLocaleDateString('pt-BR')}</p>
          {cliente.updatedAt && cliente.updatedAt !== cliente.createdAt && (
            <p className="mt-1">
              <span className="font-semibold">Última atualização:</span> {new Date(cliente.updatedAt).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}