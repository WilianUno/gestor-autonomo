'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useToast } from '@/components/Toast';
import { Briefcase, ArrowLeft, Save } from 'lucide-react';
import { servicosApi } from '@/services/api';

export default function NovoServicoPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      const dados = {
        nome: formData.nome,
        descricao: formData.descricao || undefined,
        preco: Number(formData.preco),
        duracao: formData.duracao ? Number(formData.duracao) : undefined,
      };

      await servicosApi.criar(dados);
      showToast('Serviço cadastrado com sucesso! 🎉', 'success');
      router.push('/servicos');
    } catch (error: any) {
      const mensagem = error.response?.data?.message || 'Erro ao cadastrar serviço';
      showToast(mensagem, 'error');
    } finally {
      setLoading(false);
    }
  };

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
            <Briefcase className="w-8 h-8 text-success-500" />
            Cadastrar Novo Serviço
          </h1>
          <p className="text-gray-600 mt-1">
            Preencha as informações do serviço que você oferece
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
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="success"
              size="large"
              icon={Save}
              fullWidth
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Serviço'}
            </Button>
          </div>
        </Card>
      </form>

      {/* Dica para o usuário */}
      <Card className="bg-green-50 border-2 border-green-200">
        <div className="flex gap-3">
          <div className="text-3xl">💡</div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">Dica</h3>
            <p className="text-gray-600 text-sm mb-2">
              O campo <span className="font-semibold">Nome</span> e <span className="font-semibold">Preço</span> são obrigatórios.
            </p>
            <p className="text-gray-600 text-sm">
              A <span className="font-semibold">Duração</span> ajuda você a organizar melhor sua agenda, 
              mas é opcional.
            </p>
          </div>
        </div>
      </Card>

      {/* Exemplos */}
      <Card className="bg-blue-50 border-2 border-blue-200">
        <h3 className="font-bold text-gray-800 mb-3">📋 Exemplos de Serviços</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• <span className="font-semibold">Corte Masculino</span> - R$ 35,00 (30 min)</p>
          <p>• <span className="font-semibold">Manicure Completa</span> - R$ 45,00 (60 min)</p>
          <p>• <span className="font-semibold">Instalação Elétrica Residencial</span> - R$ 150,00 (120 min)</p>
          <p>• <span className="font-semibold">Design de Logo</span> - R$ 500,00</p>
        </div>
      </Card>
    </div>
  );
}