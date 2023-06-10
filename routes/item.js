const express = require('express');
const router = express.Router();
const Item = require('../models/item');

// GET all items
// GET items by category
router.get('/:id?', async (req, res) => {
    let items;
    if (req.params.id) {
        items = await Item.find({category:req.params.id}).populate('category');
    //   items = await Item.find({ category: {_id:req.params.id} }).populate('category');
    } else {
      items = await Item.find().populate('category');
    }
    res.json(items);
  });
  
// POST a new item
router.post('/', async (req, res) => {
  const item = new Item({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    timeToComplete: req.body.timeToComplete,
    category: req.body.category,
  });
  const savedItem = await item.save();
  res.json(savedItem);
});

// PUT to update an item
router.put('/:id', async (req, res) => {
  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body,{new: true});
  res.json(updatedItem);
});

// DELETE an item
router.delete('/:id', async (req, res) => {
  const removedItem = await Item.findByIdAndRemove(req.params.id);
  res.json(removedItem);
});

module.exports = router;
