import * as Yup from 'yup';
import Product from '../models/Product';
import User from '../models/User';
import reqBodyValidation from '../utils/reqBodyValidation';

class ProductController {
  async index(req, res) {
    const products = await Product.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
      ],
    });
    return res.json(products);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      value: Yup.number().required(),
      category: Yup.string().required(),
    });

    const validationErrors = await reqBodyValidation(schema, req.body);

    if (validationErrors) {
      return res.status(400).json({
        error: validationErrors,
      });
    }

    const userIsSeller = await User.findOne({
      where: {
        id: req.userId,
        seller: true,
      },
    });

    if (!userIsSeller) {
      return res.status(401).json({
        error: 'User must be a seller to register products',
      });
    }

    const result = await Product.create({
      ...req.body,
      user_id: req.userId,
    });

    return res.json(result);
  }
}

export default new ProductController();
