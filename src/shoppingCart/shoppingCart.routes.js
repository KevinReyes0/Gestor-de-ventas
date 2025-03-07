import { Router } from "express";
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from "../middlewares/validar-jwt.js";

import {addShoppingCart, shppingCartView} from './shoppingCart.controller.js';

const router = Router();

router.post(
    "/addShoppingCart",
    [   
        validarJWT,
        validarCampos
    ],
    addShoppingCart
);

router.get("/", shppingCartView);

export default router;