const postModel = require('../Models/postModel')
const communityModel = require('../Models/communityModel')
const commentModel = require('../Models/commentModel')
const reportModel = require('../Models/reportModel')
const { default: mongoose } = require('mongoose') 
const savedModel = require('../Models/savedModels') 
const userModel = require('../Models/userModel')
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

    deletePost: async (payload) => {
        try {
            return await postModel.updateOne({ _id: payload.postId }, { $set: { deleted: true } }, { upsert: true })
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
            console.log(error)
            return error
        }
    },

    getPostComments: async (payload) => {
        try {
            return await commentModel.aggregate(
                [
                    {
                        '$match': {
                            'postId': mongoose.Types.ObjectId(payload.postId),
                            'deleted': false
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
                    }, {
                        '$addFields': {
                            'liked': {
                                $cond: [
                                    {
                                        $in: [mongoose.Types.ObjectId(payload.id), '$likedBy']
                                    }, true, false
                                ]
                            }
                        }
                    }
                ]
            )
        } catch (error) {
            return error
        }
    },

    getCommentsLength: async (postId) => {
        try {
            return await commentModel.aggregate(
                [
                    {
                        '$match': {
                            'postId': mongoose.Types.ObjectId(postId)
                        }
                    }, {
                        '$group': {
                            '_id': '_id',
                            'sum': {
                                '$sum': 1
                            }
                        }
                    },
                ]
            )
        } catch (error) {
            return error
        }
    },

    deleteComment: async (payload) => {
        try {
            return await commentModel.updateOne({ _id: payload }, { $set: { deleted: true } })
        } catch (error) {
            return error
        }
    },

    reportComment: async (payload) => {
        try {
            return await commentModel.updateOne({ _id: payload.commentId }, { $set: { 'reported.status': true, 'reported.reason': payload.reason } })
        } catch (error) {
            return error
        }
    },

    reportPost: async (payload) => {
        try {
            console.log("pay", payload)
            return await postModel.updateOne(
                { _id: payload.postId }, {
                $set: { 'reported.status': true, 'reported.reason': payload.reason },
                $push: { 'reported.reportedBy': payload.id }
            },
                { upsert: true }
            )
        } catch (error) {
            console.log("error repo", error)
            return error
        }
    },

    reportContents: async () => {
        try {
            const con = await reportModel.find({})
            console.log(con)
            return con
        } catch (error) {
            return error
        }
    },

    likeComment: async (payload) => {
        try {
            return await commentModel.updateOne({ _id: payload.commentId }, { $push: { likedBy: payload.id } })
        } catch (error) {
            return error
        }
    },
    unlikeComment: async (payload) => {
        try {
            return await commentModel.updateOne({ _id: payload.commentId }, { $pull: { likedBy: payload.id } })
        } catch (error) {
            return error
        }
    },

    getPostInfo: async (payload) => {
        try {
            return await postModel.aggregate(
                [
                    {
                        '$match': {
                            '_id': mongoose.Types.ObjectId(payload.postId)
                        }
                    }, {
                        '$lookup': {
                            'from': 'communities',
                            'localField': 'communityId',
                            'foreignField': '_id',
                            'as': 'communityDetails'
                        }
                    }, {
                        '$lookup': {
                            'from': 'users',
                            'localField': 'userId',
                            'foreignField': '_id',
                            'as': 'userDetails'
                        }
                    }, {
                        '$project': {
                            '_id': 0,
                            'communityId': 0,
                            'userId': 0,
                            'updatedAt': 0
                        }
                    }, {
                        '$addFields': {
                            'likes': {
                                '$size': '$likedBy'
                            }
                        }
                    }, {
                        '$addFields': {
                            'liked': {
                                '$cond': [
                                    {
                                        '$in': [
                                            mongoose.Types.ObjectId(payload.id), '$likedBy'
                                        ]
                                    }, true, false
                                ]
                            }
                        }
                    }
                ]
            )
        } catch (error) {
            return error
        }
    },
    // repo to check post saved or not
    isSaved : async (payload) => {
        try {
            await savedModel.findOne({userId : payload.id, saved : payload.postId }).then(res => {
                console.log("result", res) 
                if(result === null) return false
                return false 
            })     
        } catch (error) {
            return error 
        }
    },
    // repo to save post
    savePost : async (payload) => {
        try {
            return await userModel.updateOne({_id : payload.id},{$push : {savedPosts : payload.postId}}, {upsert : true}) 
        } catch (error) {
            console.log(error) 
            return error 
        }
    },
    updateUserSaved : async(userId, savedId) => {
        try {
            return await userModel.updateOne({_id : userId},{$set : {savedPosts : savedId}}, {upsert : true}) 
        } catch (error) {
            return error 
        }
    },
    // repo to unsave post 
    unsavePost : async (payload) => {
        try {
            return await userModel.updateOne({_id : payload.id},{$pull : {savedPosts : payload.postId}})
        } catch (error) {
            return error
        }
    }
}