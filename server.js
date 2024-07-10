const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
require("dotenv").config();
const Order = require("./models/order");
const Product = require("./models/product");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Set up EJS view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from 'public' folder

// Define routes
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// Dashboard Route
app.get("/", async (req, res) => {
  try {
    // Fetch popular dishes data
    const popularDishesData = await Order.aggregate([
      { $group: { _id: "$product", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 4 },
    ]);

    const popularDishes = [];
    for (const dish of popularDishesData) {
      try {
        const product = await Product.findById(dish._id);
        if (product) {
          popularDishes.push({ name: product.name });
        }
      } catch (productErr) {
        console.error(`Error fetching product for ID: ${dish._id}`, productErr);
      }
    }

    // Fetch out-of-stock items
    const outOfStockItems = await Product.find({ currentStock: 0 });

    // Fetch payment-related data (Example: Sum of all delivery fees)
    const totalDeliveryFees = await Order.aggregate([
      { $match: { status: { $ne: "Waiting" } } },
      { $group: { _id: null, totalDeliveryFee: { $sum: "$deliveryFee" } } },
    ]);
    const deliveryFee = totalDeliveryFees[0]
      ? totalDeliveryFees[0].totalDeliveryFee
      : 0;

    res.render("index", {
      title: "Bitepoint Dashboard",
      currentDate: new Date().toLocaleDateString(),
      popularDishes,
      outOfStockItems,
      deliveryFee,
    });
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send("Server Error");
  }
});

// Serve HTML fragment for dashboard (AJAX request)
app.get("/dashboard", async (req, res) => {
  try {
    const newOrders = await Order.countDocuments({ status: "Waiting" });
    const totalOrders = await Order.countDocuments();
    const waitingList = await Order.find({ status: "Waiting" }).limit(5);

    res.render("partials/dashboard", {
      newOrders,
      totalOrders,
      waitingList,
    });
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send("Server Error");
  }
});

// Serve HTML fragment for orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().populate("product");
    const outOfStockItems = await Product.find({ currentStock: 0 });

    // Fetch total delivery fees
    const totalDeliveryFees = await Order.aggregate([
      { $match: { status: { $ne: "Waiting" } } },
      { $group: { _id: null, totalDeliveryFee: { $sum: "$deliveryFee" } } },
    ]);

    const deliveryFee = totalDeliveryFees[0]
      ? totalDeliveryFees[0].totalDeliveryFee
      : 0;
    res.render("partials/orders", {
      orders,
      outOfStockItems,
      deliveryFee,
    });
  } catch (err) {
    console.error("Error fetching data for orders:", err);
    res.status(500).send("Server Error");
  }
});

// Serve HTML fragment for products (AJAX request)
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.render("partials/orders", { products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Server Error");
  }
});

// Serve HTML fragment for users (AJAX request)
app.get("/users", async (req, res) => {
  const users = [
    { name: "John Doe", role: "Admin" },
    { name: "Jane Smith", role: "Waiter" },
  ];
  res.render("partials/users", { users });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
