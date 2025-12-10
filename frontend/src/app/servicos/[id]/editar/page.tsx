'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useToast } from '@/components/Toast';
import { Edit, ArrowLeft, Save } from 'lucide-react';
import { servicosApi } from '@/services/api';
import { Servico } from '@/types';

export default function EditarServicoPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [servico, setServico] = useState<Servico | null>(null);

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    duracao: '',
  });

  // Estado de erros
  const [errors, setErrors] = useState({
    nome: '',
    preco: '',
  });

  useEffect(() => {
    carregarServico();
  }, []);

  const carregarServico = async () => {
    try {
      const id = Number(params.id);
      const response = await servicosApi.buscarPorId(id);
      const servicoData = response.data.data;
      
      setServico(servicoData);
      setFormData({
        nome: servicoData.nome || '',
        descricao: servicoData.descricao || '',
        preco: servicoData.preco?.toString() || '',
        duracao: servicoData.duracao?.toString() || '',
      });
    } catch (error) {
      showToast('Erro ao carregar serviço', 'error');
      router.push('/servicos');
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
      preco: '',
    };

    let valido = true;

    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome do serviço é obrigatório';
      valido = false;
    }

    if (!formData.preco.trim()) {
      novosErros.preco = 'Preço é obrigatório';
      valido = false;
    } else if (isNaN(Number(formData.preco)) || Number(formData.preco) <= 0) {
      novosErros.preco = 'Preço deve ser um valor positivo';
      valido = false;
    }

    setErrors(novosErros);
    return valido;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      showToast('Por favor, preencha os campos obrigatórios corretamente', 'error');
      return;
    }

    setSaving(true);

    try {
      const id = Number(params.id);
      const dados = {
        nome: formData.nome,
        descricao: formData.descricao || undefined,
        preco: Number(formData.preco),
        duracao: formData.duracao ? Number(formData.duracao) : undefined,
      };

      await servicosApi.atualizar(id, dados);
      showToast('Serviço atualizado com sucesso! ✅', 'success');
      router.push('/servicos');
    } catch (error: any) {
      const mensagem = error.response?.data?.message || 'Erro ao atualizar serviço';
      showToast(mensagem, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-success-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando dados do serviço...</p>
        </div>
      </div>
    );
  }

  if (!servico) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Serviço não encontrado</h2>
        <Button variant="success" icon={ArrowLeft} onClick={() => router.push('/servicos')}>
          Voltar para Serviços
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
            <Edit className="w-8 h-8 text-success-500" />
            Editar Serviço
          </h1>
          <p className="text-gray-600 mt-1">
            Atualize as informações de <span className="font-semibold">{servico.nome}</span>
          </p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit}>
        <Card>
          <div className="space-y-6">
            {/* Nome */}
            <Input
              label="Nome do Serviço"
              value={formData.nome}
              onChange={(value) => handleChange('nome', value)}
              placeholder="Ex: Corte Masculino"
              required
              error={errors.nome}
            />

            {/* Descrição */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Descrição (opcional)
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => handleChange('descricao', e.target.value)}
                placeholder="Ex: Corte de cabelo masculino tradicional com máquina e tesoura"
                rows={3}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-success-300 focus:border-success-500 transition-all duration-200"
              />
            </div>

            {/* Preço e Duração - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preço */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  Preço (R$)
                  <span className="text-danger-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.preco}
                  onChange={(e) => handleChange('preco', e.target.value)}
                  placeholder="Ex: 35.00"
                  required
                  className={`
                    w-full px-4 py-3 text-base
                    border-2 rounded-lg
                    focus:outline-none focus:ring-4 focus:ring-success-300
                    transition-all duration-200
                    ${errors.preco ? 'border-danger-500' : 'border-gray-300 focus:border-success-500'}
                  `}
                />
                {errors.preco && (
                  <p className="mt-2 text-sm text-danger-600 font-medium">
                    ⚠️ {errors.preco}
                  </p>
                )}
              </div>

              {/* Duração */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  Duração (minutos) - opcional
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.duracao}
                  onChange={(e) => handleChange('duracao', e.target.value)}
                  placeholder="Ex: 30"
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-success-300 focus:border-success-500 transition-all duration-200"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Tempo estimado do serviço em minutos
                </p>
              </div>
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
          <p><span className="font-semibold">Cadastrado em:</span> {new Date(servico.createdAt || '').toLocaleDateString('pt-BR')}</p>
          {servico.updatedAt && servico.updatedAt !== servico.createdAt && (
            <p className="mt-1">
              <span className="font-semibold">Última atualização:</span> {new Date(servico.updatedAt).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}