const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const usermodel = require('../Models/UserModel')


//create User api
//http://localhost:8080/user-api/create
exports.CreateUserController = async (req, res) => {
    try {

        const { name, email, phone, password, role ,profile_url} = req.body;

        // const photo = req.file.filename;


        //    console.log(req.body)
        //    console.log('name',name,);
        //    console.log('user email',email);
        //    console.log('user phone',phone);
        //    console.log('user password',password);
        //    console.log('user role',role);
        //    console.log('user file',filename);


        console.log('Full Request Object:', profile_url);

        if (!name || !email || !password || !phone) {
            return res.json({
                msg: "all fields are necessary",
                success: false
            })
        }

        const userFound = await usermodel.findOne({ email });

        if (userFound) {
            return res.json({
                success: false,
                msg: 'User Already Registered ..Try to Login '
            })
        }

        const hashedpass = await bcrypt.hash(password, 12);

        const user = new usermodel({
            name,
            email,
            phone,
            password: hashedpass,
            role,
            profileImage:profile_url
        })

        await user.save();
        return res.status(200).json({
            msg: 'New User Created',
            success: true,
            user
        })

    } catch (error) {
        console.error('Error while creating admin:', error);
        res.status(500).json({
            'error while createing admin': error,
            success: false
        })
    }
}

//Login user api
//http://localhost:8080/user-api/login
exports.UserLoginController = async (req, res) => {
    try {

        const { email, password, role } = req.body;
        //console.log('userlogin',email,password,role)

        if (!email || !password || !role) {
            return res.json({
                msg: "all fields are necessary in userform",
                success: false,
            })
        }

        const userFound = await usermodel.findOne({ email });

        if (!userFound) {
            return res.json({
                success: false,
                msg: 'User not found '
            })
        }

        // console.log(name,email,phone,password,role);
        if (userFound.role != role) {
            return res.json({
                msg: 'You are Admin!!! cant login as User',
                success: false,
            })
        }

        const match = await bcrypt.compare(password, userFound.password);
        // console.log('password match',match);
        if (!match) {

            console.log('data from backend');

            return res.json({
                success: false,
                msg: 'Invalid Password'
            })
        }



        const token = jwt.sign({ id: userFound._id }, process.env.TOKEN_SECRET, {
            expiresIn: "1d",
        });

        // console.log('login generated token',token);

        return res.status(200).json({
            success: true,
            msg: 'USER Logged in Succesfully !!',
            user: userFound,
            token,
        })



    } catch (error) {
        console.error('Error while logging user:', error);
        return res.status(500).json({
            'error while user login ': error,
            success: false
        })
    }
}


// user route to update user details
// http://localhost:8080/user-api/UpdateUser/:userId
exports.UserUpdateController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedUserData = req.body;

        // Fetch the existing user data from the database
        const existingUser = await usermodel.findById(userId);

        // Check if the user was found
        if (!existingUser) {
            return res.json({
                msg: 'User not found',
                success: false
            });
        }

        // Check if email or phone is being changed
        if (updatedUserData.email && updatedUserData.email !== existingUser.email) {
            return res.json({
                msg: 'Email cannot be changed',
                success: false
            });
        }

        if (updatedUserData.phone && updatedUserData.phone !== existingUser.phone) {
            return res.json({
                msg: 'Phone cannot be changed',
                success: false
            });
        }

        // Ensure that email and phone cannot be changed
        updatedUserData.email = existingUser.email;
        updatedUserData.phone = existingUser.phone;

        const hashedpass = await bcrypt.hash(updatedUserData.password, 12);
        updatedUserData.password = hashedpass;

        // Update the user details in the database
        const updatedUser = await usermodel.findByIdAndUpdate(userId, updatedUserData, { new: true });

        return res.status(200).json({
            msg: 'User updated successfully',
            success: true,
            user: updatedUser
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Internal server error',
            success: false
        });
    }
};



// user route to delete a user
// http://localhost:8080/user-api/DeleteUser/:userId
exports.UserDeleteController = async (req, res) => {
    try {

        const userId = req.params.userId;
        const deletedUser = await usermodel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.json({
                success: false,
                msg: 'User Account not found'
            });
        }

        res.status(200).json({
            success: true,
            msg: 'User Account Deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Internal server error'
        });
    }
};





exports.UserDetailsController = async (req, res) => {
    try {

        const userId = req.body.userId;
        const currentUser = await usermodel.findOne({ _id: userId }).select('-password');

        if (!currentUser) {
            return res.json({
                success: false,
                msg: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            msg: 'User details fetched successfully',
            user: currentUser
        });
    } catch (error) {
        console.error('UserDetailsController - Error:', error);
        return res.status(500).json({
            success: false,
            msg: 'Unable to get current user',
            error,
        });
    }
};

