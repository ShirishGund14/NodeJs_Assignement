const express = require('express');
const mongoose= require('mongoose');
require('dotenv').config();
const cors=require('cors');
const bodyParser=require('body-parser');
const adminLogin=require('./Routes/AdminRoutes/adminLogin')
const db=require('./dbConfig')



const app = express();
app.use(bodyParser.json());
app.use(cors());





//ALL routs
app.use('/admin-api',adminLogin);
// app.use('/user-api',userLogin);


app.listen(process.env.PORT,()=>{
    console.log( `Server is running on port number ${process.env.PORT}`);
})