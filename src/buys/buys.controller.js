import { response } from "express";
import User from '../users/user.model.js';
import Buys from './buys.model.js';
import ShoppingCart from '../shoppingCart/shoppingCart.model.js';
import Product from '../products/product.model.js';
import BuysHistory from './buysHistorial.model.js';

export const buyConfirmAndInvoice = async (req, res) => {
    const query = { state: true };
    const { confirmPurchase } = req.body;

    try {
        const invoice = await Buys.find(query).populate({
            path: 'keeperShoppingCart',
            match: { state: true },
            select: 'user keeperProduct',
            populate: [{ path: 'user', select: 'name' }, { path: 'keeperProduct.product', select: 'nameProduct' }]
        });

        if (confirmPurchase) {
            for (const cart of invoice) {
                if (!cart.keeperShoppingCart || !cart.keeperShoppingCart.keeperProduct) continue;


                const productsCopy = cart.keeperShoppingCart.keeperProduct.map(item => ({
                    product: item.product._id,
                    nameProduct: item.product.nameProduct,
                    price: item.product.price,
                    amount: item.amount
                }));

                for (const item of cart.keeperShoppingCart.keeperProduct) { 
                    const product = await Product.findById(item.product);
                    if (product) {

                        product.stock -= item.amount;

                        if (product.purchaseRecord == null) {
                            product.purchaseRecord = item.amount;  
                        } else {
                            product.purchaseRecord += item.amount;  
                        }

                        if (product.stock < 0) {
                            return res.status(400).json({
                                succes: false,
                                msg: `Not enough stock for product: ${product.nameProduct}`
                            });
                        }
                        if (product.stock === 0) {
                            product.state = false;
                        }
                        await product.save();
                    }
                }

                if (cart.keeperShoppingCart._id) {
                    await BuysHistory.create({
                        keeperShoppingCart: cart.keeperShoppingCart._id, 
                        products: productsCopy, 
                        state: true
                    });
                }

                await ShoppingCart.findByIdAndUpdate(cart.keeperShoppingCart._id, {
                    keeperProduct: [],
                    state: false
                });

                await Buys.findByIdAndDelete(cart._id);
            }
        }

        res.status(200).json({
            succes: true,
            msg: 'Purchase created successfully',
            invoice
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error getting categories',
            error: error.message
        });
    }
};


export const buysHistoryView = async (req, res) => {
    const {limite = 1000, desde = 0} = req.query;
    const query = { state: true };

    try {
        let buysHistory = await BuysHistory.find(query)
            .populate({path: 'keeperShoppingCart', select: 'user', populate: { path: 'user', select: 'name email' }})
            .populate({path: 'products.product', select: 'nameProduct price'})
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await BuysHistory.countDocuments(query);

        buysHistory = buysHistory.filter(history => history.keeperShoppingCart !== null);

        res.status(200).json({
            success: true,
            total,
            buysHistory
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting buys history',
            error: error.message
        });
    }
};

export const historyBuyViewByUser = async (req, res) => {
    const userId = req.usuario._id.toString();
    const {limite = 1000, desde = 0} = req.query;
    const query = { state: true };

    try {
        let buysHistory = await BuysHistory.find(query)
            .populate({path: 'keeperShoppingCart', select: 'user', populate: { path: 'user', select: 'name email' }})
            .populate({ path: 'products.product', select: 'nameProduct price' })
            .skip(Number(desde))
            .limit(Number(limite))

        buysHistory = buysHistory.filter(history => history.keeperShoppingCart !== null);

        buysHistory = buysHistory.filter(history => history.keeperShoppingCart?.user?._id.toString() === userId);

        const total = buysHistory.length;  

        res.status(200).json({
            success: true,
            total,
            buysHistory
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting buys history',
            error: error.message
        });
    }
};
