import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

import {
    addProduct, 
    productView, 
    getProductByName, 
    productCatalogByCategory, 
    updateProduct, 
    deleteProduct, 
    viewOutOfStockProducts, 
    bestSellingProducts,
    bestSellingProductsUser
} from './product.controller.js'


const router = Router();


router.post(
    "/addProduct",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        validarCampos
    ],
    addProduct
);

router.get("/", productView);

router.get("/productCatalogByCategory", productCatalogByCategory);

router.get(
    "/searchProduct",
    [
        check("id", "Is not a valid Id").isMongoId(),
    ],
    getProductByName
);

router.put(
    "/updateProduct/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "Is not a valid Id").isMongoId(),
        validarCampos
    ],
    updateProduct
);

router.delete(
    "/deleteProduct/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "Is not a valid Id").isMongoId(),
    ],
    deleteProduct
);

router.get(
    "/viewOutOfStockProducts", 
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
    ],
    viewOutOfStockProducts
);

router.get(
    "/bestSellingProducts",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
    ], 
    bestSellingProducts
);

router.get("/bestSellingProductsUsers", bestSellingProductsUser);



export default router;