import express from 'express'
import { checkAuthUser } from '../middlewares/checkAuth.js';
import {getAllOrders,deleteOrderById,getPrice, getSpecificOrders, loginUser, registerUser,getOrderById, getUserById, addOrder} from '../controllers/userController.js'
const router=express.Router();

router.post('/register',registerUser)

router.post('/login',loginUser)

router.post('/addOrder',checkAuthUser,addOrder)

router.post('/orders/:specific',checkAuthUser,getSpecificOrders)

router.get('/orders',checkAuthUser,getAllOrders)

router.get('/orders/:id',checkAuthUser,getOrderById)

router.post('/price',checkAuthUser,getPrice)

router.delete('/order/:id',checkAuthUser,deleteOrderById)
router.get('/:id',checkAuthUser,getUserById)
export default router;

//login
//register
//orders:status  status={'pending','deliverd','all'} - userid
//add order
//fetch price
//currwarehouse
