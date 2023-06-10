const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/order');
const kitchenqueue = require("../models/kitchenqueue")
const Category = require('../models/category');


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

// seting the order to complete status
router.put('/:orderId/complete', async (req, res, next) => {
  const orderId = req.params.orderId;
  //add check
  //get all categories name
  const categories = await Category.find();
  let existItems = 0
  for(i=0;i<categories.length;i++){
    if(existItems == 1) break;
    let collectionModel = mongoose.model(categories[i].name,kitchenqueue,categories[i].name);
    await collectionModel.find({ orderId: orderId, completed:false })
    .exec()
    .then((uncompletedItems) => {
      // console.log("Items left:");
      // console.log(uncompletedItems.length);
      // console.log("Catogory:",collectionModel.collection.collectionName);
      // console.log(uncompletedItems);
      if(uncompletedItems.length != 0){
        existItems = 1;
        // console.log("true");
      }
    })
    .catch((err) => {
      console.error(err);
      next(new Error('Failed to fetch uncompleted orders'));
    });
  }
  console.log(existItems);
  if(existItems == 1){
    res.status(200).send("Not completed");
  }
  else{
    // res.status(200).send("completed");
    
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
  }

});


// Create an order
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
    ////////////////////////////////////
    // create an array of objects of each item
    // insert many into collection
    console.log(order.id);
    for (i = 0; i < items.length; i++) {
      let itemsEach = []
      let collectionModel = mongoose.model(items[i].categoryName,kitchenqueue,items[i].categoryName);
      for(j=0;j<items[i].quantity;j++){
        // console.log(items[i]);
        let item = new collectionModel({
          itemName: items[i].itemName,
          orderId: order.id, 
        });
        itemsEach.push(item);
      }
      await collectionModel.insertMany(itemsEach)
      console.log(itemsEach);
    }
    ////////////////////////////////////
    // Send the order data as a response
    res.json(order.toObject()); // Include virtuals in response
    // res.json(order); // Include virtuals in response
  } catch (err) {
    // Send error message if something goes wrong
    res.status(500).send(err.message);
  }
});
// get all completed orders
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

// get all orders
router.get('/', (req, res, next) => {
  Order.find({})
    .exec()
    .then((orders) => {
      const ordersWithVirtuals = orders.map(order => order.toObject());
      // const ordersWithVirtuals = ordersWithVirtuals1.map(order => order.populate('category'));
      res.status(200).json(ordersWithVirtuals);
      // res.status(200).json(ordersWithVirtuals.populate('category'));
    })
    .catch((err) => {
      console.error(err);
      next(new Error('Failed to fetch orders'));
    });
});


module.exports = router;