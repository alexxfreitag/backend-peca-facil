import File from '../models/File';
import Product from '../models/Product';

class FileController {
  async index(req, res) {
    const files = await File.findAll();
    return res.json(files);
  }

  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const { product_id } = req.body;

    const product = await Product.findOne({ where: { id: product_id } });

    if (!product) {
      return res.status(400).json({ error: 'Produto não encontrado.' });
    }

    const file = await File.create({
      name,
      path,
    });

    product.picture_id = file.id;

    await product.save();

    return res.json(file);
  }
}

export default new FileController();
