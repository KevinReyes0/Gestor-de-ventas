import {Schema, model} from "mongoose";

const ShoppingCartSchema = Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    keeperProduct: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    state: {
        type: Boolean,
        default: true,
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('shoppingCart', ShoppingCartSchema)