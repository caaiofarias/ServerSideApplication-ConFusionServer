const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const PromotionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        default: '',
    },
    price: {
        type: Currency,
        min: 0,
    },
    featured: {
        type: Boolean,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
},{
    timestamps: true
});

const Promotions = mongoose.model('Promotions',PromotionSchema);

module.exports = Promotions;