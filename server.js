require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const uri = process.env.DB_URL;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const orderSchema = new mongoose.Schema({
    userId: String,
    productId: String,
    quantity: Number,
    completed: { type: Boolean, default: false },
  });
  
  const Order = mongoose.model('Order', orderSchema);
  


const orders = [];

app.use(bodyParser.json());
// Define routes and middleware here

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      res.status(400).send('Invalid JSON payload');
    } else if (err.status === 400 || err.status === 404) {
      res.status(400).send(err.message);
    } else {
      console.error(err.stack);
      res.status(500).send('Something went wrong!');
    }
  });
  
  app.put('/api/orders/:orderId/complete', async (req, res, next) => {
    const orderId = req.params.orderId;
  
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { completed: true },
        { new: true }
      ).exec();
  
      if (!order) {
        return next(new Error('Order not found'));
      }
  
      res.status(200).json(order);
    } catch (err) {
      console.error(err);
      next(new Error('Failed to complete order'));
    }
  });
  
  
  
  app.post('/api/orders', async (req, res, next) => {
    const { userId, productId, quantity } = req.body;
  
    if (!userId || !productId || !quantity) {
      const error = new Error('Missing required fields');
      error.status = 400;
      return next(error);
    }
  
    try {
      const order = new Order({
        userId,
        productId,
        quantity,
      });
  
      const savedOrder = await order.save();
      res.status(201).json(savedOrder);
    } catch (err) {
      console.error(err);
      next(new Error('Failed to save order'));
    }
  });
  
  
  app.get('/api/orders/completed', (req, res, next) => {
    Order.find({ completed: true })
      .exec()
      .then((completedOrders) => {
        res.status(200).json(completedOrders);
      })
      .catch((err) => {
        console.error(err);
        next(new Error('Failed to fetch completed orders'));
      });
  });
  
  app.get('/api/orders/uncompleted', (req, res, next) => {
    Order.find({ completed: false })
      .exec()
      .then((uncompletedOrders) => {
        res.status(200).json(uncompletedOrders);
      })
      .catch((err) => {
        console.error(err);
        next(new Error('Failed to fetch uncompleted orders'));
      });
  });
  
  app.get('/api/orders', (req, res, next) => {
    Order.find({})
      .exec()
      .then((orders) => {
        res.status(200).json(orders);
      })
      .catch((err) => {
        console.error(err);
        next(new Error('Failed to fetch orders'));
      });
  });
  
  
  
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
