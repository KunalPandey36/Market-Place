const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'products'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'user',
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'user',
    },
    bidAmount: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true
    },
    
}, {
    timestamps: true
});

const Bid = mongoose.model("bids",bidSchema);

module.exports = Bid;