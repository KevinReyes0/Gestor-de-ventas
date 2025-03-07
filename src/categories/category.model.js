import {Schema, model} from "mongoose";

const CategorySchema = Schema({
    nameCategory : {
        type: String,
        required: [true, 'Name required'],
        maxLength: [50, 'Cant be overcome 50 characters']
    },
    description : {
        type: String,
        required: [true, 'description required'],
        maxLength: [100, 'Cant be overcome 100 characters']
    },
    keeperProduct: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: false
    }],
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

export default model('Category', CategorySchema);