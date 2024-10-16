import { models, model, Schema } from 'mongoose'

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: { 
        type: [String],
        required: true 
    },
})

export const Product = models.Product || model('Product', ProductSchema)