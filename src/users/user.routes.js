import {Router} from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import {check} from "express-validator";
import {existeUsuarioById} from '../helpers/db.validator.js';
import {validarCampos} from '../middlewares/validar-campos.js';
import { tieneRole } from "../middlewares/validar-roles.js";

import { updateUser, updatePassword, deleteUser, updateRole} from './user.controller.js';


const router = Router();


router.put(
    "/:id",
    [
        check("id", "No es un Id valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateUser
);

router.put(
    "/passwordUpdate/:id",
    [
        check("id", "No es un Id válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updatePassword
);  

router.delete(
    "/userDelete/:id",
    [
        validarJWT,
        check("id", "No es un Id válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteUser
); 

router.put(
    "/updateRole/:id",
    [   
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "No es un Id válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateRole
); 
export default router;