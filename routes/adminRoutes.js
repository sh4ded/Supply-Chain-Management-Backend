
import express from 'express';
import { checkAuthAdmin } from '../middlewares/checkAuth.js';
import { adminLogin, approveOrder, getAllOrders, getSpecificOrders, updateStatus, updateWarehouse } from '../controllers/adminController.js';

const router=express.Router();

router.post('/login',adminLogin);

router.post('/orders',checkAuthAdmin,getAllOrders)

//router.get('/orders/:id',getOrderById)

router.post('/orders/:status',checkAuthAdmin,getSpecificOrders)

router.put('/orders/approve',checkAuthAdmin,approveOrder)

router.put('/orders/status',checkAuthAdmin,updateStatus)

router.put('/orders/current_hub',checkAuthAdmin,updateWarehouse)

export default router;