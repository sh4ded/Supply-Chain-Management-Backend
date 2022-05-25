import express from 'express'
import 'dotenv/config'
import userRoutes from './routes/userRoutes.js'
import morgan from 'morgan';
import bodyParser from 'body-parser'
import adminRoutes from './routes/adminRoutes.js'
import { checkAuthUser,checkAuthAdmin } from './middlewares/checkAuth.js';
// import  uuid from 'uuid-int'
// const generate =uuid(0);
// console.log(generate.uuid())



const app=express();
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(morgan('tiny'))

app.use('/user',userRoutes);
app.use('/admin',adminRoutes)

app.get('/',(req,res)=>{
   
    res.send("hello world")
})


app.listen(process.env.port,()=>{
    console.log("server up")

})
