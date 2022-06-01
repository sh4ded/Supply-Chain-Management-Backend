import express from 'express'
import cors from 'cors'
import { checkAuthUser } from '../middlewares/checkAuth.js';
import {getAllOrders,deleteOrderById,getPrice, getSpecificOrders, loginUser, registerUser,getOrderById, getUserById, addOrder, yourOrders, myOrders} from '../controllers/userController.js'
const router=express.Router();
router.use(cors());

router.post('/register',registerUser)

router.post('/login',loginUser)

router.post('/addOrder',checkAuthUser,addOrder)

router.post('/orders/:id',checkAuthUser,getOrderById)

router.post('/orders/specific/:specific',checkAuthUser,getSpecificOrders)

router.post('/yourOrders',checkAuthUser,yourOrders)

router.post('/myOrders',checkAuthUser,myOrders)

router.post('/orders',checkAuthUser,getAllOrders)

router.post('/price',checkAuthUser,getPrice)
router.post('/warehouse/:id',)

router.delete('/order/:id',checkAuthUser,deleteOrderById)
router.get('/:id',checkAuthUser,getUserById)
export default router;

//login
//register
//orders:status  status={'pending','deliverd','all'} - userid
//add order
//fetch price
//currwarehouse
