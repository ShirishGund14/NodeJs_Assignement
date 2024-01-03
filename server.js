const express = require('express');
const mongoose= require('mongoose');
require('dotenv').config();
const cors=require('cors');
const bodyParser=require('body-parser');
const adminAuth=require('./Routes/AdminRoutes');
const userAuth=require('./Routes/UserRoutes');

const db=require('./dbConfig')



const app = express();
app.use(bodyParser.json());
app.use(cors());


//ALL routs
app.use('/admin-api',adminAuth);
app.use('/user-api',userAuth);


app.listen(process.env.PORT,()=>{
    console.log( `Server is running on port number ${process.env.PORT}`);
})