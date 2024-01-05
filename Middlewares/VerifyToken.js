
const jwt=require('jsonwebtoken');
exports.VerifyToken=async(req,res,next)=>{


    // const headers=req.headers[`authorization`];

    if (!req.headers.cookie) {
        return res.status(404).json({
            msg: 'No cookie found'
        });
    }

    const cookies=req.headers.cookie;

    console.log('Cookie',cookies)
    
    const token=cookies.split("=")[1];

    console.log('Token genrated',token)
    if(!token){
        res.status(404).json({
            msg:'No token found'
        })
    }

    jwt.verify(String(token),process.env.TOKEN_SECRET,(err,user)=>{
        if(err){
            return res.status(400).json({
                msg:'Invalid Token'
            })
        }

        // console.log('userid',user.id);
        req.id=user.id;
    })

    next();
}