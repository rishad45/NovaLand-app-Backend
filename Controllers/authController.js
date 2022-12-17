//Repositories
const userRepo = require('../Repositories/userRepo')
const authRepo = require('../Repositories/authRepo')

//modules
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

// custom modules
const createAccessToken = require('../Config/createAccessTokens')
const createRefreshToken = require('../Config/createRefreshTokens')

module.exports = {
    // user signup request
    userSignup: async (req, res) => {
        try {
            console.log(req.body)
            const isUserExist = await userRepo.checkUsername(req.body.userName)
            const isEmailExist = await userRepo.checkEmail(req.body.email)
            if (isUserExist) {
                res.status(200).send({ message: 'Username is already been taken', success: false })
            } else if (isEmailExist) {
                res.status(200).send({ message: "Email has already been taken", success: false })
            } else {
                const { password } = req.body
                req.body.password = await bcrypt.hash(password, 10)
                let payload
                await authRepo.createAccount(req.body).then((res) => {
                    payload = {
                        id: res._id,
                        username: res.userName,
                        email: res.email
                    }
                })
                // create access token
                const accessToken = createAccessToken(res)
                // create refresh token 
                const refreshToken = createRefreshToken(res)
                // send cookie 
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    path: '/',
                    sameSite: 'strict',
                    expiresIn: 25 * 60 * 60 * 1000,
                    secure: true
                })
                // returning the access token 
                return res.json({ 'accessToken': accessToken, success: true })
            } 
        } catch (err) {
            console.log(err)
            res.status(500).send({ message: "Error in the server..please try again", success: false })
        }
    },

    // user login request
    userLogin: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await userRepo.checkEmail(email)
            if (user !== null) {
                console.log(user)
                const isPasswordmatch = await bcrypt.compare(password, user.password)
                if (isPasswordmatch) {
                    // create a access token 
                    const accessToken = createAccessToken(user)

                    // create a refresh token
                    const refreshToken = createRefreshToken(user)

                    // assigning refresh token in a http-only cookie
                    res.cookie('refreshToken', refreshToken, { 
                        httpOnly: true, 
                        path: '/',
                        sameSite: 'strict',
                        expiresIn: 24 * 60 * 60 * 1000,
                        secure: true
                    })
                    // returning the access token 
                    res.cookie('accessToken',accessToken, {
                        httpOnly : true,
                        path : '/',
                        sameSite: 'strict',
                        expiresIn: 60 * 1000,
                        secure: true
                    }) 
                    return res.json({ success: true }) 
                } else {
                    res.status(200).send({ message: "Incorrect password ! try again", success: false }) 
                }
            } else {
                console.log("no user ");
                res.status(200).send({ message: "No user in this email", success: false })
            }
        } catch (err) {
            res.status(200).send({ message: "some error occured", success: false })

        }
    },

    // refresh token request
    refresh: async (req, res) => {
        if (req.cookies?.refreshToken) {
            const refreshToken = req.cookies.refreshToken
            // console.log("here iam") 
            console.log("refresh", refreshToken)  
            console.log("refresh end") 
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET,
                (err, encoded) => {
                    if (err) {
                        // wrong refresh token
                        console.log("iam wrong")
                        return res.status(403).send({ message: "Unauthorized" }) 
                    } else {
                        // correct token so we send a new access token 
                        console.log("iam right") 
                        const { id, userName, email } = encoded 
                        console.log(userName)

                        const accessToken = jwt.sign({
                            id: id,
                            userName: userName,
                            email: email
                        }, process.env.JWT_ACCESS_SECRET, {
                            expiresIn: '1m'
                        })
                        console.log(accessToken) 
                        res.cookie('accessToken',accessToken, {
                            httpOnly : true,
                            path : '/',
                            sameSite: 'strict',
                            expiresIn: 60 * 1000,
                            secure: true
                        }) 
                        return res.status(200).send({message : "new accessToken is set", accessToken : accessToken})  
                    }
                })
        } else {
            res.status(403).send({ message: "Unauthorized" }) 
        }
    },

    // verify Auth
    verifyAuth : async (req,res) => {
        const {id, userName, email} = req.body 
        console.log("id is a", id) 
        console.log("username is x" ,userName) 
        const user = await userRepo.getuser(email) 
        console.log("user is", user)
        if(user){
            res.status(200).send({message : "Authenticated user",success : true, user : {
                id : user._id, 
                userName : user.userName,
                email : user.email
            }}) 
        }else{
            res.status(200).send({message : "user authentication error", success : false }) 
        }
    }
}