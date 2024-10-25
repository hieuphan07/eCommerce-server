const express = require('express');
const router = express.Router();

const productController = require('../controllers/product');
const { isAuth, isAdmin } = require('../middleware/auth');

// get ALL products
router.get('/products', productController.getProducts);

// get product
router.get('/products/:productId', productController.getProduct);

// create product
router.post(
	'/products/create-product',
	isAdmin,
	productController.createProduct
);

// update product
router.patch(
	'/products/:productId/edit',
	isAdmin,
	productController.updateProduct
);

// delete product
router.delete('/products/:productId', isAdmin, productController.deleteProduct);

// create new order
router.post('/create-order', isAuth, productController.postOrder);

// get all orders
router.get('/orders', isAdmin, productController.getAllOrders);

// get orders by user
router.get('/orders/:userId', isAuth, productController.getOrders);

// get order detail
router.get('/orders/:userId/:orderId', isAuth, productController.getOrder);

// render ordered products to test UI send to emal
router.get('/ordered-products', productController.getOrderedProducts);

module.exports = router;
