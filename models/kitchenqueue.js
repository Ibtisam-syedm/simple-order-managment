const mongoose = require('mongoose');

const kitchenqueue = new mongoose.Schema({
    itemName: String,
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    completed: { type: Boolean, default: false },
    placedAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
  });

  module.exports = kitchenqueue;