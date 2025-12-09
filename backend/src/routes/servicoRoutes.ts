import { Router } from 'express';
import ServicoController from '../controllers/ServicoController';
import { validateServicoCreate, validateId } from '../middlewares/validationMiddleware';

const router = Router();


router.get('/estatisticas', ServicoController.getEstatisticas);

router.get('/search', ServicoController.search);

router.post('/', validateServicoCreate, ServicoController.create);

router.get('/', ServicoController.getAll);

router.get('/:id', validateId, ServicoController.getById);

router.put('/:id', validateId, ServicoController.update);

router.delete('/:id', validateId, ServicoController.delete);

export default router;