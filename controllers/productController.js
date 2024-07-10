const Order = require("../models/order");
const Product = require("../models/product");
const { showLogs } = require("../utils/logger");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    showLogs("products", products);
    res.render("index", { products }); // Pass products array to the view
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Server Error");
  }
};

// Assuming renderProductsPage is also used for rendering products
exports.renderProductsPage = async (req, res) => {
  try {
    const products = await Product.find();
    res.render("products", { products }); // Pass products array to the view
  } catch (err) {
    console.error("Error rendering products page:", err);
    res.status(500).send("Server Error");
  }
};

exports.createProduct = async (req, res) => {
  const { name, price, description } = req.body;

  try {
    // Validate input
    if (!name || !price || !description) {
      return res
        .status(400)
        .json({ message: "Name, price, and description are required" });
    }

    const newProduct = new Product({
      name,
      price,
      description,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a specific order by ID
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

// Update order status

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, description } = req.body;

    // Validate input
    if (!productId || !name || !price || !description) {
      return res.status(400).json({
        message: "Product ID, name, price, and description are required",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, price, description },
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
