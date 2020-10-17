import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => res.json({ msg: 'Backend working' }));

export default routes;
