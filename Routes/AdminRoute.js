const { AdminLogin_Controller, CreateAdmin_controller } = require("./AdminRoutes/adminLogin");
const express = require("express");
//router object
const router = express.Router();

router.post('/create',CreateAdmin_controller);
router.post('/login',AdminLogin_Controller);


module.exports = router;