import * as Yup from 'yup';
import File from '../models/File';
import Product from '../models/Product';
import User from '../models/User';
import reqBodyValidation from '../utils/reqBodyValidation';

class ProductController {
  async index(req, res) {
    if (req.params.id) {
      const product = await Product.findOne({
        attributes: ['id', 'name', 'description', 'value', 'category'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'phone'],
          },
          {
            model: File,
            as: 'picture',
            attributes: ['id', 'path'],
          },
        ],
      });

      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      return res.json(product);
    }

    if (req.query.user_id) {
      const products = await Product.findAll({
        where: { user_id: req.query.user_id },
        attributes: ['id', 'name', 'description', 'value', 'category'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'phone'],
          },
          {
            model: File,
            as: 'picture',
            attributes: ['id', 'path', 'url'],
          },
        ],
      });

      if (!products) {
        return res
          .status(404)
          .json({ error: 'Nenhum produto encontrado para este ferro-velho' });
      }

      return res.json(products);
    }

    const products = await Product.findAll({
      attributes: ['id', 'name', 'description', 'value', 'category'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'phone'],
        },
        {
          model: File,
          as: 'picture',
          attributes: ['id', 'path', 'url'],
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
