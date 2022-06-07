import jwt from "jsonwebtoken";


export const checkAuthUser=(req,res,next)=>{
    //console.log(req.body);
    //console.log(req.params);
    let token = req.body.authorization;
    if(!token){
        res.status(403).json({error:{
            'msg':'no token available in bearer'
        }})
    }else{
        token=token.split(' ')[1];
        jwt.verify(token,process.env.secretKey,(err,decoded)=>{
            if(err){
                res.status(400).json({error:{
                    'msg':'invalid token'
                }})
            }
            res.locals.user_id=decoded.user_id;
            console.log(res.locals.user_id)
            res.locals.id = req.params.id;
            next();

        })
  }
    
}

export const checkAuthAdmin=(req,res,next)=>{
    let token =req.body.authorization;
    console.log(req.body);
    if(!token){
        res.status(403).json({error:{
            'msg':'no token available in bearer'
        }})
    }else{
        token=token.split(' ')[1];
    jwt.verify(token,process.env.secretKey,(err,decoded)=>{
        if(err){
            res.status(400).json({error:{
                'msg':'invalid token'
            }})
        }
        res.locals.admin_id=decoded.admin_id;
        next();

    })
}
    
}