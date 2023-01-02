const mongoose = require('mongoose')
const postSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    communityId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'communities'
    },
    flagged : {
        type : Boolean,
        default : false
    },
    image : {
        type : String
    },
    description : {
        type : String
    },
    location : {
        type : String
    },
    likedBy : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'users' 
        }
    ],
    deleted : {
        type : Boolean,
        default : false 
    }
},{timestamps : true}) 

const postModel = mongoose.model('posts',postSchema) 
module.exports = postModel 