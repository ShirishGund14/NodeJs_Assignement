const express=require('express');
const { CreateUserController, UserLoginController, UserUpdateController, UserDeleteController, UserDetailsController } = require('../Controllers/UserController');
const { VerifyToken } = require("../Middlewares/VerifyToken");



const router=express.Router();

router.post('/create',CreateUserController)
router.post('/login',UserLoginController)
router.put('/updateUser/:userId',UserUpdateController);
router.delete('/DeleteUser/:userId',UserDeleteController);

router.get('/UserDetails',VerifyToken,UserDetailsController);

module.exports=router;