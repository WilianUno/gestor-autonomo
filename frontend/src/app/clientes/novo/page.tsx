'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useToast } from '@/components/Toast';
import { UserPlus, ArrowLeft, Save } from 'lucide-react';
import { clientesApi } from '@/services/api';

export default function NovoClientePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      await clientesApi.criar(formData);
      showToast('Cliente cadastrado com sucesso! 🎉', 'success');
      router.push('/clientes');
    } catch (error: any) {
      const mensagem = error.response?.data?.message || 'Erro ao cadastrar cliente';
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
            <UserPlus className="w-8 h-8 text-success-500" />
            Cadastrar Novo Cliente
          </h1>
          <p className="text-gray-600 mt-1">
            Preencha as informações do cliente
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
              {loading ? 'Salvando...' : 'Salvar Cliente'}
            </Button>
          </div>
        </Card>
      </form>

      {/* Dica para o usuário */}
      <Card className="bg-blue-50 border-2 border-blue-200">
        <div className="flex gap-3">
          <div className="text-3xl">💡</div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">Dica</h3>
            <p className="text-gray-600 text-sm">
              Os campos <span className="font-semibold">Nome</span> e <span className="font-semibold">Telefone</span> são obrigatórios. 
              Os demais são opcionais, mas ajudam a ter mais informações sobre o cliente.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}