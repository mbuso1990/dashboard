const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    deliveryFee: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Waiting', 'Accepted', 'Coming to you'],
        default: 'Waiting'
    },
    locationName: {
        type: String,
        required: false
    },
    customerType: {
        type: String,
        enum: ['Customer', 'Center'],
        default: 'Customer'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
