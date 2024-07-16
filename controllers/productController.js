const Order = require("../models/order");
const Product = require("../models/product");
const { showLogs } = require("../utils/logger");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 });
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Server Error");
  }
};

exports.renderProductsPage = async (req, res) => {
  try {
    const products = await Product.find();
    res.render("products", { products });
  } catch (err) {
    console.error("Error rendering products page:", err);
    res.status(500).send("Server Error");
  }
};

exports.createProduct = async (req, res) => {
  const { name, price, description, category, quantity, image } = req.body;

  try {
    if (!name || !image || !price || !category || !quantity) {
      return res.status(400).json({
        message: "Name, image, price, category and quantity are all required",
      });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      image,
      quantity,
      category,
    });

    const savedProduct = await newProduct.save();
    showLogs("savedProduct", savedProduct);
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      name,
      price,
      description,
      quantity,
      currentStock,
      category,
      image,
    } = req.body;

    console.log(req.body);

    if (!productId || !name || !price || !category || !image) {
      return res.status(400).json({
        message:
          "Product Id, name, image, price, quantity, category are all required",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        price,
        description,
        quantity: quantity || 0,
        currentStock,
        image,
        category,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ message: "Product not found or could not be updated" });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const currentProduct = await Product.findById(req.params.id);
    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
