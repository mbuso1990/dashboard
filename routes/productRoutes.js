const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/all", productController.getAllProducts);
// EJS rendering route
router.get("/", productController.renderProductsPage);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
