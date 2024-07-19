require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 8000
const bodyParser = require('body-parser');
const userRouter = require('../Backend/router/userRouter')
require('../Backend/Db/Database')
const {Server} = require('ws')

   

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true
  }));
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))         



// Use the userRouter for handling routes
app.use('/api/user', userRouter);
app.use('/api/tyem', userRouter);

   

const server = app.listen(PORT,()=>{
    console.log(`server start at port on ${PORT}`);   
})

// WebSocket setup

const wss = new Server({server})

wss.on('connection', ws => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
  });
  
  // Store the WebSocket server in the app object
  app.set('wss', wss);       