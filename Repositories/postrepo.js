const postModel = require('../Models/postModel')
const communityModel = require('../Models/communityModel')
const commentModel = require('../Models/commentModel')
const reportModel = require('../Models/reportModel')
const { default: mongoose } = require('mongoose')
module.exports = {
    createPost: async ({ communityId, userId, image, description, location }) => {
        try {
            return await postModel.create({
                communityId,
                userId,
                description,
                location,
                image
            })
        } catch (error) {
            return error
        }
    },
    // save post in community
    savePostinCommunity: async ({ communityId, postId }) => {
        try {
            console.log("saving ...................")
            console.log("payloads", communityId, "and ", postId)
            return await communityModel.updateOne({ _id: communityId }, { $addToSet: { posts: postId } })
        } catch (error) {
            return error
        }
    },

    likePost: async ({ id, postId }) => {
        try {
            return await postModel.updateOne({ _id: postId }, { $push: { likedBy: id } })
        } catch (error) {
            return error
        }
    },

    unlikePost: async ({ id, postId }) => {
        try {
            return await postModel.updateOne({ _id: postId }, { $pull: { likedBy: id } })
        } catch (error) {
            return error
        }
    },

    deletePost : async (payload) => {
        try {
            return await postModel.updateOne({_id : payload.postId}, {$set : {deleted : true}})
        } catch (error) {
            console.log(error)
            return error 
        }
    },

    addAComment: async ({ postId, id, comment }) => {
        try {
            console.log("inside repo")
            return await commentModel.create({
                postId: postId,
                userId: id,
                comment: comment
            })
        } catch (error) {
            return false
        }
    },

    getPostComments: async (payload) => { 
        try {
            return await commentModel.aggregate( 
                [
                    {
                        '$match': {
                            'postId': mongoose.Types.ObjectId(payload.postId),
                            'deleted' : false  
                        }
                    }, {
                        '$addFields': {
                            'commentLikes': {
                                '$size': '$likedBy'
                            }
                        }
                    }, {
                        '$lookup': {
                            'from': 'users',
                            'localField': 'userId',
                            'foreignField': '_id',
                            'as': 'userDetails'
                        }
                    }
                ]
            )
        } catch (error) {
            return error
        }
    },

    getCommentsLength : async (postId) => {
        try {
            return await commentModel.aggregate(
                [
                    {
                        '$match' : {
                            'postId' : mongoose.Types.ObjectId(postId) 
                        }
                    },{
                        '$group' : {
                            '_id' : '_id',
                            'sum' : {
                                '$sum' : 1 
                            }
                        }
                    },
                ]
            )
        } catch (error) {
            return error
        }
    },

    deleteComment : async(payload) => {
        try {
            return await commentModel.updateOne({_id : payload},{$set : {deleted : true}})            
        } catch (error) {
            return error 
        }
    },

    reportComment : async (payload) => {
        try {
            return await commentModel.updateOne({_id : payload}, {$set : {'reported.status' : true, 'reported.reason' : payload.reason}})  
        } catch (error) {
            return error
        }
    },

    reportContents : async () => {
        try {
            const con =  await reportModel.find({})
            console.log(con)
            return con
        } catch (error) {
            return error
        }
    },
}