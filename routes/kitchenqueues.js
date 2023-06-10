const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const kitchenqueue = require("../models/kitchenqueue")
// Create a basic schema

// complete an item
router.put('/completeItem/:id', async (req, res) => {
  const collectionName = req.body.name;
  const Item = mongoose.model(collectionName, kitchenqueue, collectionName);
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { completed: true, completedAt: Date.now() },
      { new: true }
    ).exec();

    res.status(200).json(updatedItem.toObject()); // Include virtuals in response
  } catch (err) {
    console.error(err);
    res.status(400).json("errors"); // Include virtuals in response
  }
});
// Express.js route handling
router.post('/create-collection/:name', async (req, res) => {
  // The collection name is passed as a dynamic segment in the URL
  const collectionName = req.params.name;
  
  // Create a model using the schema. Note that Mongoose will automatically
  // create a collection with the plural form of the model name
  const Item = mongoose.model(collectionName, kitchenqueue, collectionName);
  // const category = new Category({
  //   name: collectionName
  // });
  // const savedCategory = await category.save();
  // res.json(savedCategory);
  res.send(`Collection ${collectionName} created successfully`);
});

// Express.js route handling for document insertion
router.post('/insert-document/:collectionName', async (req, res) => {
    // The collection name is passed as a dynamic segment in the URL
    const collectionName = req.params.collectionName;
  
    // Retrieve the model for the collection
    const Item = mongoose.model(collectionName,kitchenqueue);
    
    // Create a new document
    const item = new Item({
      itemName: "New Item",
      orderId: new mongoose.Types.ObjectId(),  // Replace with an actual Order ID
      // ... fill in any other required fields
    });
  
    // Save the new document to the collection
    const savedItem = await item.save();
  
    // Respond with the new document that was created
    res.json(savedItem);
  });
  
  router.post('/deleteCollection/:collectionName', async (req, res) => {
    const collectionName = req.params.collectionName
    const toDrop = mongoose.model(collectionName,kitchenqueue);

    toDrop.collection.drop()
    .then(() => {
        res.send('User collection deleted successfully');
    })
    .catch(err => {
        console.log('Error in dropping the collection:', err);
        res.status(500).send('Error in dropping the collection');
    });
});
module.exports = router;
