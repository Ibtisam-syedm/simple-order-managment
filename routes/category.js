const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Item = require('../models/item');
const kitchenqueue = require("../models/kitchenqueue")
const mongoose = require('mongoose');


async function addFoodItemTocategory(itemName,categoryName,orderId){
  //create model of category
  const toSave = mongoose.model(categoryName, kitchenqueue);
  //create object 
  const foodItem = new toSave({
    itemName: itemName,
    orderId: orderId,
  });
  //save
  const savedFoodItem = await foodItem.save();
  return savedFoodItem;
}
// GET all categories
router.get('/', async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// POST a new category
router.post('/', async (req, res) => {
  const category = new Category({
    name: req.body.name
  });
  const savedCategory = await category.save();
  const Item = mongoose.model(req.body.name, kitchenqueue, req.body.name);

  res.json(savedCategory);
});

// PUT to update a category
// issue: not updating the collection name

// Do not call this
router.put('/:id', async (req, res) => {
  const toUpdateCategory = await Category.findById(req.params.id);
  const collectionName = toUpdateCategory.name;
  const modelName = mongoose.model(collectionName, kitchenqueue);
  modelName.collection.name = req.body.name
  //////////
  const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedCategory);
});

// DELETE a category
router.delete('/:id', async (req, res) => {

  try {
    console.log(req.params.id);
    // Delete all item documents that match the specified category ID
    await Item.deleteMany({ category: req.params.id });
    const removedCategory = await Category.findByIdAndRemove(req.params.id);
    const collectionName = removedCategory.name
    const toDrop = mongoose.model(collectionName, kitchenqueue,collectionName);

    toDrop.collection.drop()
      .then(() => {
        res.send('User collection deleted successfully');
      })
      .catch(err => {
        console.log('Error in dropping the collection:', err);
        res.status(500).send('Error in dropping the collection');
      });
    // res.json({ removedCategory, message: 'Category and all items in it have been deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to category' });
  }

});

module.exports = router;
