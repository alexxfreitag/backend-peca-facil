import { Router } from 'express';

import UserController from './app/controllers/UserController';

const routes = new Router();

routes.get('/', (req, res) => res.json({ msg: 'Backend working' }));

routes.get('/users', UserController.index);
routes.post('/users', UserController.store);

export default routes;
