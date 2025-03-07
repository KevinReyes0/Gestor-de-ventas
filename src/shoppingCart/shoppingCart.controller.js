import { response } from "express";
import Product from '../products/product.model.js';
import User from '../users/user.model.js';
import ShoppingCart from '../shoppingCart/shoppingCart.model.js';
import Buy from '../buys/buys.model.js';


export const addShoppingCart = async (req, res) => {
    try {
        const { nameProduct, amount } = req.body;
        const userId = req.usuario.id;

        const product = await Product.findOne({ nameProduct });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.stock === 0) {
            return res.status(400).json({
                success: false,
                message: 'Product is out of stock'
            });
        }

        if (amount > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Requested amount (${amount}) exceeds available stock (${product.stock})`
            });
        }


        let cart = await ShoppingCart.findOne({ user: userId });

        if (!cart) {
            cart = await ShoppingCart.create({
                user: userId,
                keeperProduct: [{ product: product._id, amount }],
                state: true
            });
        } else {
            const existingProduct = cart.keeperProduct.find(p => p.product.toString() === product._id.toString());
            
            const newAmount = existingProduct ? existingProduct.amount + amount : amount;

            if (newAmount > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Adding this amount would exceed available stock (${product.stock})`
                });
            }

            if (existingProduct) {
                existingProduct.amount = newAmount;
            } else {
                cart.keeperProduct.push({ product: product._id, amount });
            }
            cart.state = true;
        }

        await cart.populate('keeperProduct.product', 'nameProduct price');

        const total = cart.keeperProduct.reduce((sum, item) => sum + (item.product.price * item.amount), 0);

        await cart.save();

        const existingBuy = await Buy.findOne({ keeperShoppingCart: cart._id });
        if (!existingBuy) {
            await Buy.create({ keeperShoppingCart: cart._id });
        };

        res.status(200).json({
            success: true,
            message: 'Product added to shopping cart successfully',
            cart,
            total
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error adding product to cart',
            error: error.message
        });
    }
};

export const shppingCartView = async (req, res) => {
    const query = {state: true};

    try {
        
        const shoppingCart = await ShoppingCart.find(query)
        .populate({path: 'user', match: {state:true}, select: 'email'})
        .populate({path: 'keeperProduct.product', match: {state:true}, select: 'nameProduct price'})
        .populate({path: 'keeperProduct', match: {state:true}, select: 'amount'})


        res.status(200).json({
            succes: true,
            shoppingCart
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error getting shopping cart',
            error: error.message
        })
    }
};