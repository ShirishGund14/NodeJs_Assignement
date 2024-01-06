const express=require('express');
const { CreateAdminController, AdminLoginController, Alluser, AdminUpdatesUser, AdminDeletesUser } = require('../Controllers/AdminControoler');
const router=express.Router();


router.post('/create',CreateAdminController)

router.post('/login',AdminLoginController)

router.get('/Allusers', Alluser);

router.put('/UpdateUser/:userId',AdminUpdatesUser);

router.delete('/DeleteUser/:userId',AdminDeletesUser);


module.exports=router;