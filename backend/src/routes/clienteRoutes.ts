import { Router } from 'express';
import ClienteController from '../controllers/ClienteController';
import { 
  validateClienteCreate, 
  validateClienteUpdate, 
  validateId 
} from '../middlewares/validationMiddleware';

const router = Router();


router.get('/estatisticas', ClienteController.getEstatisticas);

router.get('/search', ClienteController.search);

router.post('/', validateClienteCreate, ClienteController.create);

router.get('/', ClienteController.getAll);

router.get('/:id', validateId, ClienteController.getById);

router.put('/:id', validateId, validateClienteUpdate, ClienteController.update);

router.delete('/:id', validateId, ClienteController.delete);

export default router;