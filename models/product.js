const mongoose = require('mongoose')

const mongooseUniqueValidator = require('mongoose-unique-validator')

var productSchema = mongoose.Schema({
    name: { type: String, unique: true, required: true },
    ref: { type: String,unique: false, required: false },
    maker:{ type: String, required: false },
    broken:{ type: Number, default:0 },
    quantity:{ type: Number, required: false },
    minQuantity:{ type: Number, required: false },
    maxQuantity:{ type: Number, required: false },
    unite:{ type: Number, required: false },
    familyRef:{ type: String, required: false },
    location:{ type: String,unique: false, required: false },
    alert:{type:Boolean,required:false},
    annexe:{type:String,required:false},
    quantityOnSite:{ type: Number, required: false },
    imgUrl:{type:String,required:false}
    })
productSchema.plugin(mongooseUniqueValidator)

module.exports = mongoose.model("product",productSchema)