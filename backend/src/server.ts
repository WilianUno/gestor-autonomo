import express, { Request, Response } from 'express';
import cors from 'cors';
import { logMiddleware } from './middlewares/logMiddleware';
import { errorMiddleware } from './middlewares/errorMiddleware';
import clienteRoutes from './routes/clienteRoutes';
import servicoRoutes from './routes/servicoRoutes';
import agendamentoRoutes from './routes/agendamentoRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); 
app.use(express.json()); 
app.use(logMiddleware); 

app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'API Agenda Pro - Backend funcionando! 🚀',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/clientes', clienteRoutes);
app.use('/api/servicos', servicoRoutes);
app.use('/api/agendamentos', agendamentoRoutes);

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: true,
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em: http://localhost:${PORT}`);
});