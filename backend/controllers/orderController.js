const Order = require('../models/order');

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('product');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new order
exports.createOrder = async (req, res) => {
    const { product, quantity, deliveryAddress, deliveryFee, totalPrice, locationName, customerType } = req.body;

    // Basic input validation
    if (!product || !quantity || !deliveryAddress || !deliveryFee || !totalPrice || !locationName || !customerType) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const order = new Order({
            product,
            quantity,
            deliveryAddress,
            deliveryFee,
            totalPrice,
            status: 'Waiting',
            locationName,
            customerType
        });

        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('product');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const newStatus = req.body.status;

        // Validate input
        if (!orderId || !newStatus) {
            return res.status(400).json({ message: 'Order ID and status are required' });
        }

        const order = await Order.findByIdAndUpdate(orderId, { status: newStatus }, { new: true });

        if (!order) {
            return res.status(404).json({ message: 'Order not found or could not be updated' });
        }

        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
