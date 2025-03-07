import { Schema, model } from "mongoose";

const BuyHistorySchema = new Schema({
    keeperShoppingCart: {
        type: Schema.Types.ObjectId,
        ref: 'shoppingCart',
        required: true,
    },
    products: [{  
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        nameProduct: String,
        price: Number,
        amount: Number
    }],
    state: {
        type: Boolean,
        default: true,
    }
},
{
    timestamps: true,
    versionKey: false
});

export default model('BuyHistory', BuyHistorySchema);