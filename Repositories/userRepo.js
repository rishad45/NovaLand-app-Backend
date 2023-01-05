const { default: mongoose } = require('mongoose')
const communityModel = require('../Models/communityModel')
const userModel = require('../Models/userModel')
module.exports = {
    checkUsername: async (payload) => {
        try {
            return await userModel.findOne({ userName: payload })
        } catch (err) {
            return
        }
    },
    checkEmail: async (payload) => {
        try {
            return await userModel.findOne({ email: payload })
        } catch (err) {
            return
        }
    },
    getuser: async (email) => {
        try {
            return userModel.findOne({ email: email })
        } catch (error) {
            return error
        }
    },
    // for getting posts in home
    getPostsForHome: async (payload) => {
        try {
            return await communityModel.aggregate(
                [
                    {
                        '$match': {
                            'users': {
                                '$elemMatch': {
                                    'userId': mongoose.Types.ObjectId(payload.id)
                                }
                            }
                        }
                    }, {
                        '$addFields': {
                            user: mongoose.Types.ObjectId(payload.id)
                        }
                    }, {
                        '$lookup': {
                            'from': 'users',
                            'localField': 'user',
                            'foreignField': '_id',
                            'as': 'userDetails'
                        }
                    },
                    {
                        '$project': {
                            'posts': 1,
                            'name': 1,
                            'user': 1,
                            'userDetails': 1
                        }
                    }, {
                        '$lookup': {
                            'from': 'posts',
                            'localField': 'posts',
                            'foreignField': '_id',
                            'as': 'post'
                        }
                    }, {
                        '$project': {
                            post: 1,
                            name: 1,
                            user: 1,
                            _id: 0,
                            userDetails: 1
                        }
                    }, {
                        '$unwind': {
                            path: '$post'
                        }
                    }, {
                        '$match': {
                            'post.deleted': false
                        }
                    },
                    {
                        '$addFields':
                        {
                            'liked': {
                                $cond: [
                                    {
                                        $in: [mongoose.Types.ObjectId(payload.id), '$post.likedBy']
                                    }, true, false
                                ]
                            },
                        }
                    }, {
                        '$addFields': {
                            'totalLikes': {
                                $size: '$post.likedBy'
                            }
                        }
                    }, {
                        '$lookup': {
                            'from': 'communities',
                            'localField': 'post.communityId',
                            'foreignField': '_id',
                            'as': 'communityDetails'
                        }
                    }, {
                        '$unwind': {
                            'path': '$userDetails'
                        }
                    },
                    {
                        '$addFields': {
                            'saved': {
                                $cond: [
                                    {
                                        $in: ['$post._id', '$userDetails.savedPosts']
                                    }, true, false
                                ]
                            }
                        }
                    }, {
                        '$project': {
                            user: 0,
                            userDetails: 0,
                        }
                    },
                    {
                        '$sort': {
                            'post.createdAt': -1
                        }
                    }
                ]
            )
        } catch (error) {
            console.log("error ", error)
            return error
        }
    }
}

