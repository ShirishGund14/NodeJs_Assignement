const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const usermodel= require('../Models/UserModel')


//create User api
//http://localhost:8080/user-api/create
router.post('/create',async(req,res)=>{
    try {

        const {name,email,phone,password,role,profile_url}=req.body;
        console.log(name,email,phone,password,role);
        if(role!='User'){
            return res.json({
                msg:'Acesss denied ,!only users are allowed',
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

        const user= new usermodel({
            name,
            email,
            phone,
            password:hashedpass,
            profile_url,
            role:role
        })

        await user.save();
        return res.status(200).json({
            msg:'new User created',
            success:true
        })
        
    } catch (error) {
        console.error('Error while creating User:', error);
        res.status(500).json({
             'error while createing User':error,
             success:false
        })
    }
})


//Login user api
//http://localhost:8080/user-api/login
router.post('/login',async(req,res)=>{
    try {

        const {email,password}=req.body;

        if( !email || !password ) {
            return res.json({
                msg:"all fields are necessary",
                success:false,
            })
        }

        const userFound=await usermodel.findOne({email});

        if(!userFound){
            return res.status(205).json({
                success:false,
                msg:'User not found '
            })
        }

        // console.log(name,email,phone,password,role);
        if(userFound.role!='User'){
            return res.json({
                msg:'only users are allowed',
                success:false,
            })
        }

        const match=await bcrypt.compare(password,userFound.password);
        if(!match){
            return res.status(205).json({
                success:false,
                msg:'Invalid Password'
            })
        }
       
        //create and assign token
        const token = jwt.sign({ payload: userFound._id }, process.env.TOKEN_SECRET, { expiresIn: '73d' })
        res.send({
            success: true,
            msg: 'USER Logged in Succesfully !!',
            data: token,
        })

        
        
    } catch (error) {
        console.error('Error while logging user:', error);
        res.status(500).json({
             'error while user login ':error,
             success:false
        })
    }
})


// user route to update user details
// http://localhost:8080/user-api/UpdateUser/:userId
router.put('/updateUser/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedUserData = req.body;

        // Fetch the existing user data from the database
        const existingUser = await usermodel.findById(userId);

        // Check if the user was found
        if (!existingUser) {
            return res.status(404).json({ 
                msg: 'User not found',
                success: false 
            });
        }

        // Check if email or phone is being changed
        if (updatedUserData.email && updatedUserData.email !== existingUser.email) {
            return res.status(400).json({ 
                msg: 'Email cannot be changed',
                success: false 
            });
        }

        if (updatedUserData.phone && updatedUserData.phone !== existingUser.phone) {
            return res.status(400).json({ 
                msg: 'Phone cannot be changed',
                success: false 
            });
        }

        // Ensure that email and phone cannot be changed
        updatedUserData.email = existingUser.email;
        updatedUserData.phone = existingUser.phone;

        // Update the user details in the database
        const updatedUser = await usermodel.findByIdAndUpdate(userId, updatedUserData, { new: true });

        res.status(200).json({ 
            msg: 'User updated successfully', 
            success: true, 
            user: updatedUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Internal server error', 
            success: false 
        });
    }
});





// Admin route to delete a user
// http://localhost:8080/user-api/DeleteUser/:userId
router.delete('/DeleteUser/:userId', async (req, res) => {
    try {

        const userId = req.params.userId;

        // Delete the user from the database
        const deletedUser = await usermodel.findByIdAndDelete(userId);

        // Check if the user was found and deleted
        if (!deletedUser) {
            return res.status(404).json({ msg: 'User Account not found' });
        }

        res.status(200).json({ msg: 'User Account Deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});



// http://localhost:8080/admin-api/Get-current-user
// router.get('/Get-current-user', async (req, res) => {
//     try {
//         const CurrentUser = await usermodel.find({},); 
//         res.status(200).json(CurrentUser);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ msg: 'Internal server error' });
//     }
// });


module.exports=router;