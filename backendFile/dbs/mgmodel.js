let mongoose = require('mongoose');
const offerSchema =mongoose.Schema({
  offer_id:{ type: String,
    unique: true },
    offer_title:String,
    offer_description: String,
    offer_image: String,
    content: [{
      item_id:String,
      quantity:Number
    }],
    schedule:{ days_of_week: [Number],
     dates_of_month: [Number], 
     months_of_year: [Number]},
     target:String,
     pricing:[{currency:String,cost:Number}]

  });
const offer = mongoose.model('offer',offerSchema);
module.exports=offer
