const mongoose = require('mongoose');

const Product = require('../models/product.js');
const Order = require('../models/order.js');
const { sendEmail } = require('../utils/sendEmail.js');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(200).json({ error: { message: 'No product founds.' } });
    }
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = req.body;
    const reqProduct = {
      name: product.name,
      price: Number(product.price),
      category: product.category,
      long_desc: product['long_desc'],
      short_desc: product['short_desc'],
      photos: product.photos,
    };
    await Product.create(reqProduct);
    return res.status(201).json({ message: 'New product created!' });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const orders = await Order.aggregate([
      {
        $match: { 'items.productId': new mongoose.Types.ObjectId(productId) },
      },
    ]);
    if (!orders) {
      await Product.findByIdAndDelete(productId);
      return res.status(200).json({ message: 'Product deleted.' });
    } else {
      return res.status(200).json({ message: 'Can not deleted. This is item is ordering.' });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const updatingProduct = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(productId, updatingProduct, { new: true });
    return res.status(200).json(updatedProduct);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.postOrder = async (req, res, next) => {
  const order = req.body;
  const parsedItems = order.items.map((item) => {
    return {
      ...item,
      productId: new mongoose.Types.ObjectId(item._id),
      quantity: Number(item.quantity),
      amount: Number(item.amount),
    };
  });
  const parsedOrder = { ...order, items: parsedItems };
  try {
    const newOrder = new Order(parsedOrder);
    await newOrder.save();
    const recentOrder = await Order.findOne({ _id: newOrder._id }).populate({
      path: 'items',
      populate: { path: 'productId' },
    });
    sendEmail(order.contact.email, recentOrder);
    return res.status(201).json({ message: 'Order sent', newOrder });
  } catch (err) {
    return next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    if (orders && orders.length > 0) {
      return res.status(200).json(orders);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  // const userId = req.session.user._id;
  const reqUserId = req.params.userId;
  try {
    const orderByUser = await Order.find({ userId: reqUserId });
    if (orderByUser) {
      return res.status(200).json(orderByUser);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  const userId = req.params.userId;
  const orderId = req.params.orderId;
  try {
    const orders = await Order.find({ userId: userId }).populate({
      path: 'items',
      populate: { path: 'productId' },
    });
    if (!orders) {
      return res.status(500).json({ error: { message: 'No orders found.' } });
    }

    const order = orders.find((order) => order._id.toString() === orderId.toString());
    if (!order) {
      return res.status(500).json({ error: { message: 'No orders found.' } });
    }

    res.status(200).json(order);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// render ordered products to test UI send to email
exports.getOrderedProducts = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: '66432ceeeda27cdd9038d21c',
    }).populate({ path: 'items', populate: { path: 'productId' } });

    const parsedItems = order.items.map((item) => {
      return {
        productId: {
          ...item.productId._doc,
          price:
            Number(item.productId.price).toLocaleString('en', {
              useGrouping: true,
            }) +
            ' ' +
            'VND',
        },
        amount: Number(item.amount).toLocaleString('en', { useGrouping: true }) + ' ' + 'VND',
        quantity: Number(item.quantity),
      };
    });
    const parsedOrder = {
      ...order._doc,
      items: parsedItems,
      total:
        Number(order._doc.total).toLocaleString('en', {
          useGrouping: true,
        }) +
        ' ' +
        'VND',
    };
    return res.render('ordered-products.ejs', { order: parsedOrder });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

