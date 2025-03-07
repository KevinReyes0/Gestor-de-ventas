import { response } from "express";
import Product from './product.model.js';
import Category from '../categories/category.model.js';

export const addProduct = async (req, res) => {
    try {
        
        const { nameProduct, ...data} = req.body; 
        
        const category = await Category.findOne({nameCategory: data.nameCategory});
        
        const existingProduct = await Product.findOne({ nameProduct: nameProduct.trim() });
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                msg: 'Product already exists'
            });
        }

        const product = new Product({
            nameProduct: nameProduct.trim(),
            ...data,
            keeperCategory: category._id,
        });

        await product.save();
    
        await Category.findByIdAndUpdate(category._id, {
            $push: { keeperProduct: product._id}
        });

        res.status(200).json({
            succes: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error creating category',
            error: error.message
        })
    }
};

export const productView = async (req, res) => {
    const {limite = 100, desde = 0} = req.query;
    const query = {state: true};

    try {
        
        const product = await Product.find(query)
            .populate({path: 'keeperCategory', match: {state:true}, select: 'nameCategory'})
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await Product.countDocuments(query);

        res.status(200).json({
            succes: true,
            total,
            product
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error getting categories',
            error: error.message
        })
    }
};

export const getProductByName = async (req, res) => {
    try {
        const {nameProduct} = req.query;
        const query = {state: true};

        if (nameProduct){
            query.nameProduct = {$regex: new RegExp(nameProduct, 'i')}
        }
    
        const product = await Product.find(query).populate({path: 'keeperCategory', match: {state:true}, select: 'nameCategory'});

        if(!product){
            return res.status(404).json({   
                succes: false,
                msg: 'Product not found',
                error: error.message
            })
        };
        
        res.status(200).json({
            succes: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msj: 'Error getting product',
            error: error.message
        })
    }
};

export const productCatalogByCategory = async (req, res) => {
    const { categoryName, limite = 100, desde = 0 } = req.query;

    try {
        if (!categoryName) {
            return res.status(400).json({
                success: false,
                msg: 'Category name is required'
            });
        }

        const category = await Category.findOne({ nameCategory: categoryName, state: true });

        if (!category) {
            return res.status(404).json({
                success: false,
                msg: 'Category not found'
            });
        }

        const products = await Product.find({ keeperCategory: category._id, state: true })
            .populate({ path: 'keeperCategory', select: 'nameCategory' })
            .skip(Number(desde))
            .limit(Number(limite))
            .select('-stock -purchaseRecord');;

        const total = await Product.countDocuments({ keeperCategory: category._id, state: true });

        res.status(200).json({
            success: true,
            total,
            products
        });
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({
            success: false,
            msg: 'Internal server error',
            error: error.message
        });
    }
};

export const updateProduct = async (req, res  = response) => {
    try {
        const {id} = req.params;
        const {_id, ...data} = req.body;
        data.state = true;

        const product = await Product.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            succes: true,
            msj: 'Product updated successfully',
            product
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msj: "Error updating product",
            error: error.message
        })
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {

        await Product.findByIdAndUpdate(id, { state: false });

        res.status(200).json({
            success: true,
            message: 'Product disabled.',
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error deleting Product',
            error: error.message,
        });
    }
};

export const viewOutOfStockProducts = async (req, res) => {
    const {limite = 100, desde = 0} = req.query;
    const query = {state: false,  stock: 0};

    try {
        
        const product = await Product.find(query)
            .populate({path: 'keeperCategory', match: {state:true}, select: 'nameCategory'})
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await Product.countDocuments(query);

        res.status(200).json({
            succes: true,
            total,
            product
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error getting categories',
            error: error.message
        })
    }
};

export const bestSellingProducts = async (req, res) => {
    const {limite = 100, desde = 0} = req.query;
    const query = {state: true};

    try {
        
        const product = await Product.find(query)
            .populate({path: 'keeperCategory', match: {state:true}, select: 'nameCategory'})
            .sort({ purchaseRecord: -1 }) 
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await Product.countDocuments(query);

        res.status(200).json({
            succes: true,
            total,
            product
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error getting categories',
            error: error.message
        })
    }
};

export const bestSellingProductsUser = async (req, res) => {
    const {limite = 100, desde = 0} = req.query;
    const query = {state: true};

    try {
        
        const product = await Product.find(query)
            .populate({path: 'keeperCategory', match: {state:true}, select: 'nameCategory'})
            .sort({ purchaseRecord: -1 }) 
            .skip(Number(desde))
            .limit(Number(limite))
            .select('-stock -purchaseRecord');

        const total = await Product.countDocuments(query);

        res.status(200).json({
            succes: true,
            total,
            product
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error getting categories',
            error: error.message
        })
    }
};