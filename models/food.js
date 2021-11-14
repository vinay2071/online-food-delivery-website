const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodSchema = new Schema({
 dishName: {
    type: String,
    required: true,
  },
 restName: {
    type: String,
    required: true,
  },
 price: {
    type: String,
    required: true
  }
});

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;