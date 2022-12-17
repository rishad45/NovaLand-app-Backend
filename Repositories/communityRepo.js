const { default: mongoose } = require('mongoose')
const communityModel = require('../Models/communityModel')
const userModel = require('../Models/userModel')
module.exports = {
    createCommunity: async (payload) => {
        try {
            console.log("payload", payload)
            return await communityModel.create({
                admin: payload.id,
                name: payload.comName,
                category: payload.category,
                privacy: payload.privacy
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
    }
}