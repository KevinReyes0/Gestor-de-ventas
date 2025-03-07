import {Schema, model} from "mongoose";

const BuySchema = Schema({

    keeperShoppingCart: {
        type: Schema.Types.ObjectId,
        ref: 'shoppingCart',
        required: true,
    },
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

export default model('Buy', BuySchema)