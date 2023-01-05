const { default: mongoose } = require('mongoose')
const communityModel = require('../Models/communityModel')
const postModel = require('../Models/postModel')
const userModel = require('../Models/userModel')
module.exports = {
    createCommunity: async (payload) => {
        try {
            console.log("payload", payload)
            return await communityModel.create({
                admin: payload.id,
                name: payload.comName,
                category: payload.category,
                privacy: payload.privacy,
                users: [{
                    userId: payload.id
                }]
            })
        } catch (error) {
            return error
        }
    },

    getAllCommunities: async (payload) => {
        try {
            return await communityModel.find({})
        } catch (error) {
            return error
        }
    },

    getUserCommunities: async (payload) => {
        try {
            console.log("load", payload)
            return await communityModel.aggregate(
                [
                    {
                        '$match': {
                            '$and': [
                                {
                                    'users.userId': mongoose.Types.ObjectId(payload)
                                }, {
                                    'users.pending': false
                                }, {
                                    'users.banned': false
                                }
                            ]
                        }
                    }
                ]
            )
        } catch (error) {
            return error
        }
    },

    getRecommendedCommunities: async (payload) => {
        try {
            return await communityModel.aggregate(
                [
                    {
                        '$match': {
                            'users.userId': {
                                '$ne': mongoose.Types.ObjectId(payload)
                            }
                        }
                    }
                ]
            )
        } catch (error) {

        }
    },

    getCommunityById: async (payload) => {
        try {
            return await communityModel.findOne({ _id: payload }, { name: 1, privacy: 1 })
        } catch (error) {
            return error
        }
    },
    // join in a community
    joinInPublicCommunity: async (payload) => {
        try {
            return await communityModel.updateOne({ _id: payload.communityId }, { $push: { users: { userId: payload.id } } })
        } catch (error) {
            return error
        }
    },

    joinInPrivateCommunity: async (payload) => {
        try {
            return await communityModel.updateOne({ _id: payload.communityId }, { $push: { users: { userId: payload.id, pending: true } } })
        } catch (error) {
            return error
        }
    },

    getCommunityInfo: async (payload) => {
        try {
            return await communityModel.aggregate(
                [
                    {
                        '$match': {
                            '_id': mongoose.Types.ObjectId(payload)
                        }
                    }, {
                        '$lookup': {
                            'from': 'users',
                            'localField': 'admin',
                            'foreignField': '_id',
                            'as': 'admin'
                        }
                    }, {
                        '$project': {
                            '_id': 0,
                            'admin._id': 0,
                            'admin.password': 0,
                            'admin.__v': 0,
                            '__v': 0
                        }
                    }
                ]
            )
        } catch (error) {
            console.log(error)
            return error
        }
    },

    checkUserinCommunity: async (payload) => {
        try {
            const response = await communityModel.find({ _id: payload.communityId, users: { $elemMatch: { userId: payload.userId } } })
            if (response.length != 0) return true
            return false
        } catch (error) {
            return error
        }
    },
    checkIsuserAdmin: async (payload) => {
        try {
            const response = await communityModel.findOne({ _id: payload.communityId, admin: payload.userId })
            console.log("is admin", response)
            if (response === null) return false
            return true
        } catch (error) {

        }
    }, 
    communityPosts : async (payload) => {
        try {
            console.log(payload) 
            return await postModel.find({communityId : payload.communityId, deleted : false}).sort({createdAt : -1})    
        } catch (error) {
            return error 
        }
    },
    // leave community
    leaveCommunity: async (payload) => {
        return await communityModel.updateOne({ _id: payload.communityId },
            { $pull: { users: { userId: payload.id } } }
        )
    },
    updateProfile: async (id, key, isCover) => {
        if (isCover) return await communityModel.updateOne({ _id: id }, { $set: { coverPicture: key } },{upsert : true})  
        return await communityModel.updateOne({ _id: id }, { $set: { profilePicture: key } })
    }
}