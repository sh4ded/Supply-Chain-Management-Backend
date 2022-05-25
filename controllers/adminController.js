import db from '../config/db.config.js'
import bcrypt from 'bcrypt';
import moment from 'moment';
import jwt from 'jsonwebtoken'



export const adminLogin=(req,res)=>{
    if(req.body.admin_id===''){
        res.status(400).json({"success":false,
    "message":"please enter valid admin id"})
    }

    db.query("select * from admins where admin_id=?",[req.body.admin_id],(err,result,fields)=>{
        if(err)
        res.status(500).json({'message':err.message})
        if(result.length===0)
        res.status(404).json({error:{
            'message':'no admin found'
        }})

        if(req.body.password!==result[0].password)
        res.status(400).json({'msg':'invalid credentials'})
        else{
        const token =jwt.sign({admin_id:req.body.admin_id},process.env.secretKey,{
            expiresIn:86000
        })

        res.status(201).json({
           admin_id: req.body.admin_id,
            accessToken:token
        })
    }


      
        
    })

}

export const getAllOrders=(req,res)=>{
    db.query('select * from orders',(err,result,fields)=>{
        if(err)
        res.status(500).json({error:{'message':err.message}})
        res.status(201).json({order:result})
    })

}

export const getOrderById=(req,res)=>{
    const order_id =req.params.id;
    db.query("select * from orders where order_id=?",[order_id],(err,result,fields)=>{
        if(err)
        res.status(500).json({error:{'message':err.message}})

        if(result.length===0){
            res.status(400).json({error:{'message':'order not found'}})
        }
        res.status(201).json({'order':result})
    })

}

export const updateStatus=(req,res)=>{
    const status=req.body.status;
    const order_id=req.body.order_id;
    if(status!=='delivered'&&status!='accepted'&&status!='rejected')
    res.status(400).json({error:{
        'message':'invalid status option'
    }})

    db.query('update orders set status= ? where order_id=?',[status,order_id],(err,result,fields)=>{
        if(err)
        res.status(500).json({error:{'message':err.message}})
        if(fields.affectedRows<1)
        res.status(201).json({'success':false,message:'invalid order_id'})

        res.status(200).json({'success':true,'message':'status updated successfully'})

    })


}
export const getSpecificOrders=(req,res)=>{
    const specific =req.params.status;
    if(specific!=='pending'&&specific!=='approved'&&specific!=='delivered'&&specific!=='rejected')
    res.status(400).json({error:{
        'message':'your specification is wrong'
    }})
    else{

    
    db.query('select * from orders where status =?',[specific],(err,result,fields)=>{
        if(err)
        res.status(500).json({error:{'message':err.message}})
        res.status(201).json(result)
    })
}


}

export const approveOrder=(req,res)=>{
    const date=req.body.expected_date
    console.log(date)
    const order_id =req.body.order_id;
    const expected_date=moment(date).format('YYYY-MM-DD');
    const vehicle_id=req.body.vehicle_id;

    db.query('update orders set expected_date=? and vehicle_id=? where order_id=?',[expected_date,vehicle_id,order_id],(err,result,fields)=>{

        if(err)
        res.status(500).json({error:{'message':err.message}})
        else if(result.affectedRows<1)
        res.status(201).json({'success':false,message:'invalid order_id'})
        else
        res.status(200).json({'success':true,'message':'status updated successfully'})

    })

    //expectedDate

}

export const updateWarehouse =(req,res)=>{
    const current_hub =req.body.current_hub;
    const order_id =req.body.order_id;
    db.query('update orders set current_hub=? where order_id=?',[current_hub,order_id],(err,result,fields)=>{
        console.log(result)
        if(err)
        res.status(500).json({error:{'message':err.message}})
        if(result.affectedRows===0){
            res.status(400).json({error:{'message':"couldn't update record" }})
        }else{
        
        res.status(200).json({
            'success':true,
            'message':'warehouse updated successfully'
        })
    }      

    })

}

