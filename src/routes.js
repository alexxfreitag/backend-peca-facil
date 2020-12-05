import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', (req, res) => res.json({ msg: 'Backend working' }));

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.index);

routes.get('/products', ProductController.index);
routes.get('/products/:id', ProductController.index);
routes.put('/products/:id', ProductController.update);
routes.post('/products', ProductController.store);

routes.get('/files', FileController.index);
routes.post('/files/products/:id', upload.single('file'), FileController.store);

export default routes;
