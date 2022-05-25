import db from '../config/db.config.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import  uuid from 'uuid-int'
import moment from 'moment'
const generate =uuid(0);
// console.log(generate.uuid())


export const registerUser=(req,res)=>{
    const hashedPassword =bcrypt.hashSync(req.body.password,10);
    const user ={
        user_id:generate.uuid(),
        email:req.body.email,
        password:hashedPassword,
        company_name:req.body.company_name,
        location:req.body.location
    }
    db.query("insert into users (user_id,email,password,company_name,location) values (?,?,?,?,?) ",[user.user_id,user.email,user.password,user.company_name,user.location],(err,result,fields)=>{
        if(err)
        res.status(500).json({error:{
            'message':err.message
        }})
        

        if(result.affectedRows>0){
            const token= jwt.sign({user_id:user.user_id},process.env.secretKey,{
                expiresIn:86000
            })

            res.status(201).json({
                id:user.user_id,
                accessToken:token
            })
        }else{
            res.status(500).json({error:{
                'msg':'could not register user'
            }})
        }
        
    })


    
}

export const loginUser=(req,res)=>{
    if(req.body.email===''){
        res.status(400).json({"success":false,
    "message":"please enter email"})
    }

    db.query("select * from users where email=?",[req.body.email],(err,result,fields)=>{
        if(err)
        res.status(500).json({'message':err.message})
        if(result.length==0)
        res.status(404).json({error:{
            'message':'no user found'
        }})
        else{
            bcrypt.compare(req.body.password,result[0].password,(err,comp)=>{
                if(err)
                res.status(400).json(err)
                if(comp==false)
                res.status(400).json({'msg':'invalid credentials'})
                else{
                    const token= jwt.sign({user_id:result[0].user_id},process.env.secretKey,{
                        expiresIn:86000
                    })
        
                    res.status(201).json({
                        id:result[0].user_id,
                        accessToken:token
                    })
                }
    
               
    
            })
        }
            
        })

        
        
}

export const getUserById=(req,res)=>{
    const _id =req.params.id;
   
    db.query('select * from users where user_id=?',[_id],(err,result,fields)=>{
        if(err)
        res.status(500).json({'msg':err.message})
       
        if(result.length===0)
        res.status(404).json({error:{'message':'no user found'}})
        else{

        res.status(201).json({user:{
            'company_name':result[0].company_name,
            'address':result[0].location,
            'email':result[0].email

        }})
    }
        
    })
    
}

export const addOrder=async (req,res)=>{

     const order={
    'order_id':generate.uuid(),
    'user_id':req.body.user_id,
     'source' :req.body.source,
     'destination':req.body.destination,
     'products':req.body.product,
     'weight':req.body.weight,
     'amount':req.body.amount,
     'status':'pending',
     'order_date':moment(new Date()).format('YYYY-MM-DD'),
     'expected_date':moment(new Date()).format('YYYY-MM-DD'),
     'current_hub':req.body.source,
     "vehicle_id":0
     }

     db.query('insert into orders set ?',[order],(err,result,fields)=>{
         if(err)
         res.status(500).json({error:{
             'message':err.message
         }})
         res.status(201).json({
             'success':true,
             order_id:order.order_id,
             message:'order placed successfully'
         });
     })


}

export const getSpecificOrders=(req,res)=>{
    const specific =req.params.specific;
    if(specific!=='pending'&&specific!=='approved'&&specific!=='delivered'&&specific!='rejected')
    res.status(400).json({error:{
        'message':'your specification is wrong'
    }})
    db.query('select * from orders where status =? and user_id=?',[specific,res.locals.user_id],(err,result,fields)=>{
        if(err)
        res.status(500).json({error:{'message':err.message}})
        res.status(201).json({orders:result})
    })

}

export const getAllOrders=(req,res)=>{
    db.query('select * from orders where user_id=?',[res.locals.user_id],(err,result,fields)=>{
        if(err)
        res.status(500).json({error:{'message':err.message}})
        res.status(201).json({orders:result})
    })

}

export const getOrderById=(req,res)=>{
    const order_id =req.params.id;
    db.query("select * from orders where order_id=?",[order_id],(err,result,fields)=>{
        if(err)
        res.status(500).json({error:{'message':err.message}})

        if(result.length==0){
            res.status(400).json({error:{'message':'order not found'}})
        }
        res.status(201).json({'order':result})
    })

}

export const getPrice=(req,res)=>{
    const from_warehouse =req.body.from_warehouse;
    const to_warehouse =req.body.to_warehouse;

    db.query("select * from price_plans where from_warehouse=? and to_warehouse =?",[from_warehouse,to_warehouse],(err,result,fields)=>{
        if(err)
        res.status(500).json({error:{'message':err.message}})
     
        if(result.length===0)
        res.status(404).json({error:{'message':'invalid warehouses'}})
        else
        res.status(201).json({pricing:{
            from_warehouse,
            to_warehouse,
            'price_per_kg':result[0].price_per_kg,
            'price_plan_name':result[0].price_plan_name
        }})

    })

}

export const deleteOrderById=(req,res)=>{
    const order_id =req.params.id;
    db.query("delete from orders where order_id=? and user_id=?",[order_id,res.locals.user_id],(err,result,fields)=>{
        if(err)
        res.status(500).json({error:{'message':err.message}})
        if(fields.affectedRow==0){
            res.status(400).json({error:{'message':"couldn't delete record" }})
        }
        res.status(200).json({
            'success':true,
            'message':'record deleted successfully'
        })
    })

}