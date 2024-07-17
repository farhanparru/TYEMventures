require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 8000
const bodyParser = require('body-parser');
const userRouter = require('../Backend/router/userRouter')
require('../Backend/Db/Database')

   

app.use(cors({
    origin:["http://localhost:5173"],
    methods:"GET,POST,PUT,DELETE",
    credentials:true
}))
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))         



// Use the userRouter for handling routes
app.use('/api/user', userRouter);
app.use('/api/tyem/order_catalog', userRouter);

   

app.listen(PORT,()=>{
    console.log(`server start at port on ${PORT}`);   
})