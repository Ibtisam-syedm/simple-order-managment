const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Item = require('../models/item');

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
  res.json(savedCategory);
});

// PUT to update a category
router.put('/:id', async (req, res) => {
  const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body,{new:true});
  res.json(updatedCategory);
});

// DELETE a category
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
    
        // Delete all item documents that match the specified category ID
        await Item.deleteMany({ category: id });
        const removedCategory = await Category.findByIdAndRemove(req.params.id);

        // res.json(removedCategory);
        res.json({ removedCategory,message: 'Category and all items in it have been deleted' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete items' });
      }

});

module.exports = router;
