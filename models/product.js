const mongoose = require('mongoose')

const mongooseUniqueValidator = require('mongoose-unique-validator')

var productSchema = mongoose.Schema({
    name: { type: String, unique: true, required: true },
    ref: { type: String,unique: true, required: true },
    maker:{ type: String, required: false },
    quantity:{ type: Number, required: false },
    minQuantity:{ type: Number, required: false },
    maxQuantity:{ type: Number, required: false },
    location:{ type: String,unique: false, required: false },
    alert:{type:Boolean,required:false},
    annexe:{type:String,required:false},
    quantityOnSite:{ type: Number, required: false },
    imgUrl:{type:String,required:false}
    })
productSchema.plugin(mongooseUniqueValidator)

module.exports = mongoose.model("product",productSchema)