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
        console.log(req.body.password);
        console.log(result[0].password);
        if(req.body.password!=result[0].password)
        res.status(400).json({'msg':'invalid credentials'})
        else{
        const token =jwt.sign({admin_id:req.body.admin_id},process.env.secretKey,{
            expiresIn:86000
        })

        res.status(201).json({
            warehouse_id : result[0].warehouse_id,
            admin_id: req.body.admin_id,
            accessToken:token
        })
    }
    })
}

export const getAllOrders=(req,res)=>{
    db.query('select warehouse_id from admins where admin_id=?',[res.locals.admin_id],(err,result,fields)=>{
        if(err)
        res.status(500).json({error:{'message':err.message}})
        else{
            console.log(result)
            db.query('select * from orders where source = ?',[result[0].warehouse_id],(err,result,fields)=>{
                if(err)
                res.status(500).json({error:{'message':err.message}})
                else
                res.status(201).json({order:result})
            })
        }
    }) 
}

export const getOrderById=(req,res)=>{
    console.log(req.body);
    const order_id = req.params.id;
    db.query("select * from orders where order_id=?",[order_id],(err,result,fields)=>{
        if(err)
        res.status(500).json({error:{'message':err.message}})
        else{
            if(result.length===0){
                res.status(400).json({error:{'message':'order not found'}})
            }
            else
            res.status(201).json({'order':result})
        }
    })
}

export const updateStatus=(req,res)=>{
    const warehouse_id=req.body.warehouse_id;
    const status=req.body.status;
    const order_id=req.body.order_id;
    if(status!=='delivered'&&status!=='approved'&&status!=='rejected'&&status!=='pending')
    res.status(400).json({error:{
        'message':'invalid status option'
    }})
    else{
    db.query('update orders set status= ?,current_hub= ? where order_id=?',[status,warehouse_id,order_id],(err,result,fields)=>{
        if(err)
        res.status(500).json({error:{'message':err.message}})
        else if(result.affectedRows<1)
        res.status(201).json({'success':false,message:'invalid order_id'})
        else
        res.status(200).json({'success':true,'message':'status updated successfully'})

    })
}

}

export const getPendingOrders=(req,res)=>{
        db.query('select warehouse_id from admins where admin_id=?',[res.locals.admin_id],(err,result,fields)=>{
            if(err)
            res.status(500).json({error:{'message':err.message}})
            else{
                console.log(result)
                db.query('select * from orders where source = ? and status = "pending"',[result[0].warehouse_id],(err,result,fields)=>{
                    if(err)
                    res.status(500).json({error:{'message':err.message}})
                    else
                    res.status(201).json({orders:result})
                })
    
            }
        })   
}


export const getHistoryOrders=(req,res)=>{
        db.query('select warehouse_id from admins where admin_id=?',[res.locals.admin_id],(err,result,fields)=>{
            if(err)
            res.status(500).json({error:{'message':err.message}})
            else{
                console.log(result)
                db.query('select * from orders where source = ? and status in ("delivered","rejected")',[result[0].warehouse_id],(err,result,fields)=>{
                    if(err)
                    res.status(500).json({error:{'message':err.message}})
                    else
                    res.status(201).json({orders:result})
                })
    
            }
        })   
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

export const getVehicles =(req,res)=>{
    db.query('select warehouse_id from admins where admin_id=?',[res.locals.admin_id],(err,result,fields)=>{
        if(err)
        res.status(500).json({error:{'message':err.message}})
        else{
            console.log(result)
            console.log(req.body)
            db.query('select * from vehicles where from_location=? and to_location=?',[result[0].warehouse_id, req.body.destination],(err,result,fields)=>{
                console.log(result)
                if(err)
                res.status(500).json({error:{'message':err.message}})
                else
                res.status(201).json({vehicles:result})
            })

        }
    })
}

export const putVehicles =(req,res)=>{
    console.log(req.body);
    db.query('select warehouse_id from admins where admin_id=?',[res.locals.admin_id],(err,result,fields)=>{
        if(err)
        res.status(500).json({error:{'message':err.message}})
        else{
        console.log(result)
        db.query('update  vehicles set allocated_space=? where vehicle_id=?',[req.body.allocated_space,req.body.vehicle_id],(err,result,fields)=>{
            db.query('update orders set vehicle_id=?,status="approved",expected_date=DATE_ADD(order_date,interval 3 day) where order_id=?',[req.body.vehicle_id, req.body.order_id], (error, ress, field) => {
                if(err)
            res.status(500).json({error:{'message':err.message}})
            else
            {
                if (error)
                res.status(500).json({error:{'message':err.message}})
                else
                res.status(201).json({message:"vehicle updated successfully"})
            }
            })
            })
        }
    })
}

export const rejectOrder = (req,res) => {
    db.query('update orders set status="rejected" where order_id=?',[req.body.order_id],(err,result,fields)=>{
        if(err)
        res.status(500).json({error:{'message':err.message}})
        else
            res.status(201).json({message:"Order Rejected successfully"})
    })
}

export const getWarehouse =(req,res)=>{
    console.log(req.params);
    db.query('select * from warehouses where warehouse_id',[req.params.id],(err,result,fields)=>{
        if(err)
        res.status(500).json({error:{'message':err.message}})
    else
        res.status(201).json({orders:result})
    })
}

//get vehicle by source

//put vehicle weight

//

