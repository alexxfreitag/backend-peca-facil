import * as Yup from 'yup';
import User from '../models/User';
import reqBodyValidation from '../utils/reqBodyValidation';

class UserController {
  async index(req, res) {
    const users = await User.findAll();
    return res.json(users);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    const validationErrors = await reqBodyValidation(schema, req.body);

    if (validationErrors) {
      return res.status(400).json({
        error: validationErrors,
      });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists)
      return res.status(409).json({ error: 'Email address already used.' });

    const { id, name } = await User.create(req.body);

    return res.json({ id, name });
  }
}

export default new UserController();
