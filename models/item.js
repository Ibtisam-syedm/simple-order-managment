const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  timeToComplete: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category',required: true},
});

module.exports = mongoose.model('Item', itemSchema);
