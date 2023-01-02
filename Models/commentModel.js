const mongoose = require("mongoose");

const commentSchema= mongoose.Schema({
    postId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'posts'
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users' 
    },
    comment : {
        type : String,
        required : true
    },
    likedBy : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'users'
        }
    ],
    replies : [
        {
            userId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'users'
            },
            reply : {
                type : String
            },
            likes : {
                type : Number,
                default : 0
            }
        }
    ],
    reported : {
        status : {
            type : Boolean,
            default : false
        },
        reason : {
            type : String
        },
        time : {
            type : Date,
            default : Date.now() 
        }
    },
    deleted : {
        type : Boolean,
        default : false
    }
},{timestamps : true}) 

const commentModel = mongoose.model('comments',commentSchema) 

module.exports = commentModel