const express=require('express');
const { CreateUserController, UserLoginController, UserUpdateController, UserDeleteController, UserDetailsController } = require('../Controllers/UserController');
const authMiddleware = require("../Middlewares/authMiddleware");



const router=express.Router();

router.post('/create',CreateUserController)
router.post('/login',UserLoginController)
router.put('/updateUser/:userId',UserUpdateController);
router.delete('/DeleteUser/:userId',UserDeleteController);

router.post('/UserDetails',authMiddleware,UserDetailsController);

module.exports=router;