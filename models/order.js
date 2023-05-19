const mongoose = require('mongoose');
const itemInOrderSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    quantity: { type: Number, required: true },
  });
  
  const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [itemInOrderSchema],
    completed: { type: Boolean, default: false },
  });

  module.exports = mongoose.model('Order', orderSchema);
