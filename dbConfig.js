const mongoose=require('mongoose');

mongoose.connect(process.env.MONGO_URL);

const connection =mongoose.connection;

connection.on('connected',()=>{
    console.log('Database Connected Successfully!!!')
})

connection.on('error',()=>{
    console.log('Database Failed to Connect.....')
})

module.exports=connection;