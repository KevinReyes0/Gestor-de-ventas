import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

import { addCategory, categoryView, deleteCategory, updateCategory } from './category.controller.js'

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        tieneRole('ADMIN_ROLE'),
        validarCampos
    ],
    addCategory
);

router.get("/", categoryView);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole('ADMIN_ROLE'),
        check("id", "It is not a valid id").isMongoId(),
        validarCampos         
    ],
    deleteCategory
);

router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "It is not a valid id").isMongoId(),
        validarCampos
    ],
    updateCategory
);

export default router;