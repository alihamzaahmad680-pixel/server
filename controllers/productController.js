import cloudinary from "cloudinary";
import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    const images = req.files;

    const imagesURL = await Promise.all(
      images.map(async (img) => {
        const result = await cloudinary.v2.uploader.upload(img.path);
        return result.secure_url;
      }),
    );

    const product = await Product.create({
      ...productData,
      image: imagesURL,
    });

    res.json({ success: true, message: "Product added", product });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const productList = async (req, res) => {
  const products = await Product.find({});
  res.json({ success: true, products });
};

export const changeStock = async (req, res) => {
  const { id, inStock } = req.body;

  await Product.findByIdAndUpdate(id, { inStock });

  res.json({ success: true, message: "Stock updated" });
};
