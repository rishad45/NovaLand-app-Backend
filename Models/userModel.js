const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    email: {
        type: String,
        index: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    communities: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'communities'
            },
            joinedAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    requestedCommunities: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'communities'
            },
            requestedAt : {
                type: Date,
                default: Date.now()
            } 
        }
    ],
    followers : [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            },
            followedAt : {
                type: Date,
                default: Date.now()
            } 
        }
    ],
    following : [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            },
            followedAt : {
                type: Date,
                default: Date.now()
            } 
        }
    ],
    pendingUserRequests : [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            },
            requestedAt : { 
                type: Date,
                default: Date.now()
            } 
        }
    ],
    myCommunities : [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'communities'
            },
            createdDate : {
                type: Date,
                default: Date.now() 
            } 
        }
    ] 
},{timestamps : true})

const userModel = mongoose.model('Users', userSchema)
module.exports = userModel 