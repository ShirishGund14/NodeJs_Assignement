const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const usermodel= require('../../Models/UserModel')


//createAdmin api
//http://localhost:8080/admin-api/create
router.post('/create',async(req,res)=>{
    try {

        const {name,email,phone,password,role,profile_url}=req.body;
        console.log(name,email,phone,password,role);
        if(role!='Admin'){
            return res.json({
                msg:'Acesss denied ,!only admins are allowed',
                success:false
            })
        }
        if(!name || !email || !password ) {
            return res.json({
                msg:"all fields are necessary",
                success:false
            })
        }

        const hashedpass=await bcrypt.hash(password,12);

        const admin= new usermodel({
            name,
            email,
            phone,
            password:hashedpass,
            profile_url,
            role:role
        })

        await admin.save();
        return res.status(200).json({
            msg:'new Admin created',
            success:true
        })
        
    } catch (error) {
        console.error('Error while creating admin:', error);
        res.status(500).json({
             'error while createing admin':error,
             success:false
        })
    }
})


//LoginAdmin api
//http://localhost:8080/admin-api/login
router.post('/login',async(req,res)=>{
    try {

        const {email,password}=req.body;

        if( !email || !password ) {
            return res.json({
                msg:"all fields are necessary",
                success:false,
            })
        }

        const adminFound=await usermodel.findOne({email});

        if(!adminFound){
            return res.status(205).json({
                success:false,
                msg:'Admin not found '
            })
        }

        // console.log(name,email,phone,password,role);
        if(adminFound.role!='Admin'){
            return res.json({
                msg:'Acesss denied ,!only admins are allowed',
                success:false,
            })
        }

        const match=await bcrypt.compare(password,adminFound.password);
        if(!match){
            return res.status(205).json({
                success:false,
                msg:'Invalid Password'
            })
        }
       
        //create and assign token
        const token = jwt.sign({ payload: adminFound._id }, process.env.TOKEN_SECRET, { expiresIn: '73d' })
        res.send({
            success: true,
            msg: 'Admin Logged in Succesfully !!',
            data: token,
        })

        
        
    } catch (error) {
        console.error('Error while logging admin:', error);
        res.status(500).json({
             'error while admin login ':error,
             success:false
        })
    }
})



module.exports=router;