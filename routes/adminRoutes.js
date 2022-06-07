import cors from 'cors';
import express from 'express';
import { checkAuthAdmin } from '../middlewares/checkAuth.js';
import { adminLogin, approveOrder, getAllOrders, getOrderById, getHistoryOrders, getPendingOrders, updateStatus, updateWarehouse, getWarehouse, getVehicles, putVehicles, rejectOrder } from '../controllers/adminController.js';

const router=express.Router();
router.use(cors());

router.post('/login',adminLogin);

router.post('/orders',checkAuthAdmin,getAllOrders)

router.post('/orders/:id',checkAuthAdmin,getOrderById)

router.post('/orderspending',checkAuthAdmin,getPendingOrders)

router.post('/ordershistory',checkAuthAdmin,getHistoryOrders)

router.put('/orders/approve',checkAuthAdmin,approveOrder)

router.put('/orders/status',checkAuthAdmin,updateStatus)

router.put('/orders/current_hub',checkAuthAdmin,updateWarehouse)

router.post('/warehouse/:id', checkAuthAdmin, getWarehouse)

router.post('/vehicles', checkAuthAdmin, getVehicles)

router.post('/putvehicle', checkAuthAdmin, putVehicles)

router.post('/rejectorder', checkAuthAdmin, rejectOrder)

export default router;