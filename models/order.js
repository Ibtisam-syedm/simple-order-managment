const mongoose = require('mongoose');
const itemInOrderSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    categoryName:{ type: String, required: true },
    quantity: { type: Number, required: true },
  });
  
  const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [itemInOrderSchema],
    completed: { type: Boolean, default: false },
    placedAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

orderSchema.virtual('totalTime').get(function() {
    if(this.completedAt){
        const diffInMilliseconds = this.completedAt - this.placedAt;
        const diffInMinutes = diffInMilliseconds / (1000 * 60); // time in minutes
        // const diffInMinutes = diffInMilliseconds / 1000; // in seconds
        return diffInMinutes;
    }
    return null;
});

orderSchema.virtual('timePassed').get(function() {
  if (this.completed) {
      return this.totalTime;
  } else {
      const now = new Date();
      const diffInMilliseconds = now - this.placedAt;
      const diffInMinutes = diffInMilliseconds / (1000 * 60);
      // const diffInMinutes = diffInMilliseconds / 1000;
      return diffInMinutes;
  }
});


  module.exports = mongoose.model('Order', orderSchema);
