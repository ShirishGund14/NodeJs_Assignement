const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const usermodel= require('../Models/UserModel')


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


//get all users
// http://localhost:8080/admin-api/Allusers
router.get('/Allusers', async (req, res) => {
    try {
        // Check if the user making the request has admin role
        // if (req.user.role !== 'Admin') {
        //     return res.status(403).json({ message: 'Access forbidden. Admin rights required.' });
        // }

        // Fetch all users from the database
        const Allusers = await usermodel.find({}, '-password'); // Exclude the password field
        
        
        res.status(200).json(Allusers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});


// Admin route to update user details
// http://localhost:8080/admin-api/Allusers/:userId
router.put('/UpdateUser/:userId', async (req, res) => {
    try {

        const userId = req.params.userId;
        const updatedUserData = req.body;

        // Check if the new phone number is already in use by another user
        if (updatedUserData.phone) {
            const existingUserWithPhone = await usermodel.findOne({ 
                phone: updatedUserData.phone,
                 _id: { $ne: userId } 
                });

            if (existingUserWithPhone) {
                return res.status(400).json({ 
                    msg: 'Phone number is already in use by another user.',
                     success: false });
            }
        }

        // Check if the new email address is already in use by another user
        if (updatedUserData.email) {
            const existingUserWithEmail = await usermodel.findOne({ 
                email: updatedUserData.email,
                 _id: { $ne: userId } 
                });
            if (existingUserWithEmail) {
                return res.status(400).json({ 
                    msg: 'Email address is already in use by another user.', 
                    success: false });
            }
        }

        // Update the user details in the database
        const updatedUser = await usermodel.findByIdAndUpdate(userId, updatedUserData, { new: true });

        // Check if the user was found and updated
        if (!updatedUser) {
            return res.status(404).json({ 
                msg: 'User not found',
                 success: false });
        }

        res.status(200).json({ 
            msg: 'User updated successfully', 
           success: true, user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({
             msg: 'Internal server error', 
             success: false });
    }
});




// Admin route to delete a user
// http://localhost:8080/admin-api/DeleteUser/:userId
router.delete('/DeleteUser/:userId', async (req, res) => {
    try {

        const userId = req.params.userId;

        // Delete the user from the database
        const deletedUser = await usermodel.findByIdAndDelete(userId);

        // Check if the user was found and deleted
        if (!deletedUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json({ msg: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});




module.exports=router;