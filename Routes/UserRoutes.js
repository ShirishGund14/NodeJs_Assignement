const express=require('express');
const { CreateUserController, UserLoginController, UserUpdateController, UserDeleteController, UserDetailsController } = require('../Controllers/UserController');
const authMiddleware = require("../Middlewares/authMiddleware");
const { ImgUploadControoler } = require('../Controllers/ImgController');
const multer=require('multer')
const upload=multer({dest:'uploads/'})


const router=express.Router();

router.post('/create',upload.single('image'), CreateUserController)
router.post('/login',UserLoginController)
router.put('/updateUser/:userId',UserUpdateController);
router.delete('/DeleteUser/:userId',UserDeleteController);
router.post('/Upload',ImgUploadControoler);

router.post('/UserDetails',authMiddleware,UserDetailsController);

module.exports=router;