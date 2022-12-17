const jwt = require('jsonwebtoken')

const verifyAuth = (req,res,next) => {
    console.log("inside auth")
    // const authHeader = req.headers.Authorization || req.headers.authorization 
    // if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(403) 
    // const token = authHeader.split(' ')[1]
    const token = req?.cookies?.accessToken 
    console.log("access", token)
    jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET,
        (err,decoded) => {
            if(err) return res.status(403).send({message : "Invalid token", success : false })
            // req.body =  {id,userName,email} =  decoded 
            req.body.id = decoded.id
            req.body.email = decoded.email
            req.body.userName = decoded.userName 
            console.log("success auth")
            next()  
        }
    )
}

module.exports = verifyAuth 

