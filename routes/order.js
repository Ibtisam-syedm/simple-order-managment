const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Error handling middleware
router.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      res.status(400).send('Invalid JSON payload');
    } else if (err.status === 400 || err.status === 404) {
      res.status(400).send(err.message);
    } else {
      console.error(err.stack);
      res.status(500).send('Something went wrong!');
    }
  });

  router.put('/:orderId/complete', async (req, res, next) => {
    const orderId = req.params.orderId;
  
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { completed: true, completedAt: Date.now() },
        { new: true }
      ).exec();
  
      if (!order) {
        return next(new Error('Order not found'));
      }
  
      res.status(200).json(order.toObject()); // Include virtuals in response
    } catch (err) {
      console.error(err);
      next(new Error('Failed to complete order'));
    }
});

  
  
router.post('/', async (req, res, next) => {
  try {
      const { userId, items } = req.body;
      
      // Create a new order
      const order = new Order({
          userId,
          items,
          completed: false,
          placedAt: Date.now()
      });
  
      // Save the order in the database
      await order.save();
  
      // Send the order data as a response
      res.json(order.toObject()); // Include virtuals in response
  } catch(err) {
      // Send error message if something goes wrong
      res.status(500).send(err.message);
  }
});

  router.get('/completed', (req, res, next) => {
    Order.find({ completed: true })
      .exec()
      .then((completedOrders) => {
        const ordersWithTotalTime = completedOrders.map(order => order.toObject());
        res.status(200).json(ordersWithTotalTime);
      })
      .catch((err) => {
        console.error(err);
        next(new Error('Failed to fetch completed orders'));
      });
});


  router.get('/uncompleted', (req, res, next) => {
    Order.find({ completed: false })
      .exec()
      .then((uncompletedOrders) => {
        const ordersWithTimePassed = uncompletedOrders.map(order => order.toObject());
        res.status(200).json(ordersWithTimePassed);
      })
      .catch((err) => {
        console.error(err);
        next(new Error('Failed to fetch uncompleted orders'));
      });
});

  
router.get('/', (req, res, next) => {
  Order.find({})
    .exec()
    .then((orders) => {
      const ordersWithVirtuals = orders.map(order => order.toObject());
      res.status(200).json(ordersWithVirtuals);
    })
    .catch((err) => {
      console.error(err);
      next(new Error('Failed to fetch orders'));
    });
});


  module.exports = router;