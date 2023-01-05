const express = require('express')
const app = express()

const cors = require('cors')
const cookieParser = require('cookie-parser')

// file uploading
const bodyParser = require('body-parser')

const jwt = require('jsonwebtoken')

// Configuring dotenv
const dotenv = require('dotenv').config()
const connectToDB = require('./Config/dbConnect')
const allowedOrigins = require('./Config/allowedOrigins') 
connectToDB()

// cors
app.use(cors(
    {
        origin: allowedOrigins, // allow the server to accept request from different origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true // allow session cookie from browser to pass through 
    }
))

// Setting up middlewares to parse request body and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(fileUpload({ 
//     useTempFiles : true,
//     limits:{
//         fileSize: 10 * 100 * 1000 * 5
//     }
// })) 
app.use(express.static("files"));

// API routes
const userRoute = require('./routes/userRouter')
const adminRoute = require('./routes/adminRouter')

// routes as middleware app.use 
app.use('/', userRoute)
app.use('/admin', adminRoute)




app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.listen(5000, () => {
    console.log("server started on 5000");
})

app.get('/', (req, res) => {
    res.write('hello dev')
    res.end()
})

// const upload = multer({ dest: "public/files" });


module.exports = app


