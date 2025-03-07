import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

import {buyConfirmAndInvoice, buysHistoryView, historyBuyViewByUser} from './buys.controller.js';

const router = Router();

router.get("/", buyConfirmAndInvoice);

router.get(
    "/historyBuys/", 
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
    ],
    buysHistoryView
);

router.get(
    "/historyBuyViewByUser/", 
    [
        validarJWT
    ],
    historyBuyViewByUser
);

export default router;