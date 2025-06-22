const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
  name:{type:String,required:true},
  itemImage:{type:String, required:true},
  type:{type:String, required:true},
  description:{type:String, required:true},
  additionalImage:{type:[String],default:[]},
  addedBy:{type:mongoose.Schema.Types.ObjectId, ref:"User"}
});

const Item = mongoose.model('Item',itemSchema);
module.exports = Item;