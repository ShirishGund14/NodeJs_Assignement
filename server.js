const express = require('express');
const mongoose= require('mongoose');
const cookieParser = require('cookie-parser')
require('dotenv').config();
const cors=require('cors');
const bodyParser=require('body-parser');
const AdminRoutes=require('./Routes/AdminRoutes');
const UserRoutes=require('./Routes/UserRoutes');

const db=require('./dbConfig')


const app = express();
app.use(cors({origin: 'http://localhost:3000', // Replace with the actual origin of your client application
credentials: true,}));

app.use(cookieParser())
app.use(bodyParser.json());




  


//ALL routs
app.use('/admin-api',AdminRoutes);
app.use('/user-api',UserRoutes);


app.listen(process.env.PORT,()=>{
    console.log( `Server is running on port number ${process.env.PORT}`);
})