import { Router } from 'express';
import AgendamentoController from '../controllers/AgendamentoController';
import { validateAgendamentoCreate, validateId } from '../middlewares/validationMiddleware';

const router = Router();

router.get('/estatisticas', AgendamentoController.getEstatisticas);

router.get('/periodo', AgendamentoController.getByPeriodo);

router.get('/cliente/:clienteId', validateId, AgendamentoController.getByCliente);

router.get('/status/:status', AgendamentoController.getByStatus);

router.post('/', validateAgendamentoCreate, AgendamentoController.create);

router.get('/', AgendamentoController.getAll);

router.get('/:id', validateId, AgendamentoController.getById);

router.put('/:id', validateId, AgendamentoController.update);

router.patch('/:id/cancelar', validateId, AgendamentoController.cancelar);

router.delete('/:id', validateId, AgendamentoController.delete);

export default router;