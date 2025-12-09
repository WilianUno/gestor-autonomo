'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Users, Briefcase, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { clientesApi, servicosApi, agendamentosApi } from '@/services/api';
import { Estatisticas } from '@/types';

export default function HomePage() {
  const [stats, setStats] = useState<Estatisticas>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      const [clientes, servicos, agendamentos] = await Promise.all([
        clientesApi.estatisticas(),
        servicosApi.estatisticas(),
        agendamentosApi.estatisticas(),
      ]);

      setStats({
        ...clientes.data.data,
        ...servicos.data.data,
        ...agendamentos.data.data,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="space-y-6">
      {/* Cabeçalho amigável */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Bem-vindo ao Agenda Pro! 👋
        </h1>
        <p className="text-lg text-gray-600">
          Gerencie seus clientes e agendamentos de forma simples
        </p>
      </div>

      {/* Cards de estatísticas - GRANDES e VISUAIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
          <Users className="w-16 h-16 text-primary-500 mx-auto mb-3" />
          <p className="text-5xl font-bold text-gray-800 mb-2">
            {stats.total_clientes || 0}
          </p>
          <p className="text-lg font-semibold text-gray-600">Clientes</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
          <Briefcase className="w-16 h-16 text-success-500 mx-auto mb-3" />
          <p className="text-5xl font-bold text-gray-800 mb-2">
            {stats.total_servicos || 0}
          </p>
          <p className="text-lg font-semibold text-gray-600">Serviços</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
          <Calendar className="w-16 h-16 text-purple-500 mx-auto mb-3" />
          <p className="text-5xl font-bold text-gray-800 mb-2">
            {stats.total_agendamentos || 0}
          </p>
          <p className="text-lg font-semibold text-gray-600">Agendamentos</p>
        </Card>
      </div>

      {/* Status dos agendamentos */}
      <Card title="Status dos Agendamentos">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
            <Clock className="w-10 h-10 text-warning-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-800">{stats.pendentes || 0}</p>
            <p className="text-sm font-semibold text-gray-600">Pendentes</p>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <AlertCircle className="w-10 h-10 text-primary-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-800">{stats.confirmados || 0}</p>
            <p className="text-sm font-semibold text-gray-600">Confirmados</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <CheckCircle className="w-10 h-10 text-success-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-800">{stats.concluidos || 0}</p>
            <p className="text-sm font-semibold text-gray-600">Concluídos</p>
          </div>

          <div className="text-center p-4 bg-red-50 rounded-lg border-2 border-red-200">
            <XCircle className="w-10 h-10 text-danger-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-800">{stats.cancelados || 0}</p>
            <p className="text-sm font-semibold text-gray-600">Cancelados</p>
          </div>
        </div>
      </Card>

      {/* Ações rápidas - BOTÕES GRANDES */}
      <Card title="O que deseja fazer?">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/clientes">
            <Button variant="primary" size="large" icon={Users} fullWidth>
              Gerenciar Clientes
            </Button>
          </Link>

          <Link href="/servicos">
            <Button variant="success" size="large" icon={Briefcase} fullWidth>
              Gerenciar Serviços
            </Button>
          </Link>

          <Link href="/agenda">
            <Button variant="primary" size="large" icon={Calendar} fullWidth>
              Ver Agenda
            </Button>
          </Link>

          <Link href="/agenda/novo">
            <Button variant="success" size="large" icon={Calendar} fullWidth>
              Novo Agendamento
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}