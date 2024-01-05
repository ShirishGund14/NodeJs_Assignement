const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const usermodel= require('../Models/UserModel')


//createAdmin api
//http://localhost:8080/admin-api/create
exports.CreateAdminController=async(req,res)=>{
    try {

        const {name,email,phone,password,role,profile_url}=req.body;
        

        if(role!='Admin'){
            return res.json({
                msg:'You are Admin, select the checkbox',
                success:false
            })
        }
        if(!name || !email || !password ) {
            return res.json({
                msg:"all fields are necessary",
                success:false
            })
        }

        console.log("Adminroutes",name,email,phone,password,role);
        const adminFound=await usermodel.findOne({email});
        
        console.log("adminfound",adminFound)
        if(adminFound){
            return res.json({
                success:false,
                msg:'Already Registered .....Login '
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
}


//LoginAdmin api
//http://localhost:8080/admin-api/login
exports.AdminLoginController=async(req,res)=>{
    try {

        const {email,password,role}=req.body;

        console.log('Adminlogin',email,password,role);

        if( !email || !password ) {
            return res.json({
                success:false,
                msg:"all fields are necessary",
            })
        }

        const adminFound=await usermodel.findOne({email});

        if(!adminFound){
            return res.json({
                success:false,
                msg:'Admin not found ',
            })
        }

        // console.log(name,email,phone,password,role);
        if(adminFound.role!=role){
            return res.json({
                success:false,
                msg:'Acesss denied ,Users cant login as Admin',
                
            })
        }

        const match=await bcrypt.compare(password,adminFound.password);
        console.log('pasword match',match);
        if(!match){
            console.log('before return  match',match);
            return res.json({
                success:false,
                msg:'Invalid Password'
            })
        }
       
        //create and assign token
        const token = jwt.sign({ Userid: adminFound._id }, process.env.TOKEN_SECRET, { expiresIn: '73d' })
        return res.status(200).json({
            success: true,
            msg: 'Admin Logged in Succesfully !!',
            token: token,
        })

    } catch (error) {
        console.error('Error while logging admin:', error);
        return res.status(500).json({
             'error while admin login ':error,
             success:false
        })
    }
}


//get all users
// http://localhost:8080/admin-api/Allusers
exports.Alluser= async (req, res) => {
    try {

        const Allusers = await usermodel.find({}, '-password'); // Exclude the password field
        res.status(200).json(Allusers);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
}


// Admin route to update user details
// http://localhost:8080/admin-api/Allusers/:userId
exports.AdminUpdatesUser=async (req, res) => {
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
                return res.json({ 
                    msg: 'Email address is already in use by another user.', 
                    success: false });
            }
        }

        // Update the user details in the database
        const updatedUser = await usermodel.findByIdAndUpdate(userId, updatedUserData, { new: true });

        // Check if the user was found and updated
        if (!updatedUser) {
            return res.json({ 
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
}




// Admin route to delete a user
// http://localhost:8080/admin-api/DeleteUser/:userId
exports.AdminDeletesUser= async (req, res) => {
    try {

        const userId = req.params.userId;

        // Delete the user from the database
        const deletedUser = await usermodel.findByIdAndDelete(userId);

        // Check if the user was found and deleted
        if (!deletedUser) {
            return res.json({ msg: 'User not found' });
        }

        res.status(200).json({ msg: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

