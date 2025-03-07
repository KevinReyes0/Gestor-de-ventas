import {Schema, model} from "mongoose";

const ProductSchema = Schema({
    nameProduct : {
        type: String,
        required: [true, 'Name required'],
        maxLength: [50, 'Cant be overcome 50 characters']
    },
    description : {
        type: String,
        required: [true, 'description required'],
        maxLength: [100, 'Cant be overcome 100 characters']
    },
    stock: {
        type: Number,
        required: true
    },
    keeperCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    purchaseRecord: {
        type: Number,
        required: false
    },
    state: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        versionKey: false,
    }
);

export default model('Product', ProductSchema);