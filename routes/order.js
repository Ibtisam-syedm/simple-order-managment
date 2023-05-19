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
  
  
  
  router.post('/', async (req, res, next) => {
    try {
        const { userId, items } = req.body;
        
        // Create a new order
        const order = new Order({
          userId,
          items,
          completed: false
        });
    
        // Save the order in the database
        await order.save();
    
        // Send the order data as a response
        res.json(order);
      } catch(err) {
        // Send error message if something goes wrong
        res.status(500).send(err.message);
      }
    // const { userId, productId, quantity } = req.body;
  
    // if (!userId || !productId || !quantity) {
    //   const error = new Error('Missing required fields');
    //   error.status = 400;
    //   return next(error);
    // }
  
    // try {
    //   const order = new Order({
    //     userId,
    //     productId,
    //     quantity,
    //   });
  
    //   const savedOrder = await order.save();
    //   res.status(201).json(savedOrder);
    // } catch (err) {
    //   console.error(err);
    //   next(new Error('Failed to save order'));
    // }
  });
  
  
  router.get('/completed', (req, res, next) => {
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
  
  router.get('/uncompleted', (req, res, next) => {
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
  
  router.get('/', (req, res, next) => {
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

  module.exports = router;