const mongoose = require('mongoose')

const mongooseUniqueValidator = require('mongoose-unique-validator')

var productSchema = mongoose.Schema({
    name: { type: String, unique: true, required: true },
    ref: { type: String,unique: true, required: true },
    maker:{ type: String, required: true },
    quantity:{ type: Number, required: true },
    minQuantity:{ type: Number, required: true },
    maxQuantity:{ type: Number, required: true },
    location:{ type: String,unique: true, required: true },
    maker:{ type: String, required: true },
    })
productSchema.plugin(mongooseUniqueValidator)

module.exports = mongoose.model("product",productSchema)