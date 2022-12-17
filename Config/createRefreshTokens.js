const jwt = require('jsonwebtoken')

const createRefreshToken = (payload) => {
    console.log(2)
    return jwt.sign({
        id: payload._id,
        userName: payload.userName,
        email: payload.email
    }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '1d' 
    })
}

module.exports = createRefreshToken