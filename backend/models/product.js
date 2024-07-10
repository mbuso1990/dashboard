const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    category: String,
    price: Number,
    image: String,
    totalStock: Number,
    currentStock: Number,
    status: {
        type: String,
        enum: ['running low', 'sufficient', 'excess'],
        default: 'excess'
    }
});

module.exports = mongoose.model('Product', productSchema);
