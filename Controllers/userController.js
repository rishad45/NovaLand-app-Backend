// repositories
const communityRepo = require('../Repositories/communityRepo')
const postrepo = require('../Repositories/postrepo')
const userRepo = require('../Repositories/userRepo')

const getSignedUrl = require('../Config/s3').getImagesBykeys
const getCommentsLength = require('../Helpers/commentLength')
module.exports = {
    // getuser : async (req,res) => { 
    //     console.log(req.body) 
    //     const data = await userRepo.getuser(req.body.userName) 
    //     res.status(200).send({message : "succesful", userName : data.userName})   
    // }
    // api for creating community 
    createCommunity: async (req, res) => {
        try {
            console.log("inside here")
            console.log(req.body)
            const comm = await communityRepo.createCommunity(req.body)
            console.log("is saved", comm)
            if (comm != null) {
                res.status(200).send({ message: "umm", success: true })
            } else {
                res.status(200).send({ message: "Cannot create a community", success: false })
            }
        } catch (error) {
            res.status(500).send({ message: "server error", success: false })
        }
    },
    // api for getting recommended communities 
    getRecommendedCommunities: async (req, res) => {
        try {
            const { id } = req.body
            const communities = await communityRepo.getRecommendedCommunities(id)
            console.log(communities)
            res.status(200).send({ message: "fetched succesfully", success: true, data: communities })
        } catch (error) {
            res.status(500).send({ message: "fetch unsucceful", success: false, communities: null })
        }
    },
    // api for getting user communities 
    getUserCommunities: async (req, res) => {
        try {
            const { id } = req.body
            const communities = await communityRepo.getUserCommunities(id)
            console.log(communities)
            res.status(200).send({ message: "fetched succesfully", success: true, data: communities })
        } catch (error) {
            res.status(500).send({ message: "fetch unsucceful", success: false, communities: null })
        }
    },
    // api for getting all communities 
    getAllCommunities: async (req, res) => {
        try {
            const communities = await communityRepo.getAllCommunities()
            console.log(communities)
            if (communities.length === 0) {
                res.status(200).send({ message: "fetched succesfully", success: true, data: null })
            } else {
                res.status(200).send({ message: "fetched succesfully", success: true, data: communities })
            }
        } catch (error) {
            res.status(500).send({ message: "server error", success: false })
        }

    },

    // api for joining request in communities
    joinInCommunity: async (req, res) => {
        try {
            // api will get userId and community Id
            const { id, communityId } = req.body
            console.log("req body", req.body)
            // get community
            const curr = await communityRepo.getCommunityById(communityId)
            console.log("commun", curr)
            if (curr.privacy === 'Private') {
                // private ac
                const data = await communityRepo.joinInPrivateCommunity(req.body)
                if (data) {
                    res.status(200).send({ message: `Succesfully joined in ${curr.name}`, success: true })
                }
            } else {
                // public ac
                const data = await communityRepo.joinInPublicCommunity(req.body)
                console.log("last data", data)
                if (data) {
                    res.status(200).send({ message: `Succesfully joined in ${curr.name}`, success: true })
                }
            }
            //test
            // res.status(200).send({ message: `Succesfully joined in ${curr.name}`, success: true }) 
        } catch (error) {
            res.status(500).send({ message: `Join request for ${curr.name} is failed`, success: false })
        }
    },

    // api for getting community info by id 
    getCommunityInfoById: async (req, res) => {
        try {
            const { communityId, id } = req.body
            const information = await communityRepo.getCommunityInfo(communityId)
            if (information) {
                console.log(information)
                const payload = {
                    userId: id,
                    communityId: communityId
                }
                const isMember = await communityRepo.checkUserinCommunity(payload)
                const isAdmin = await communityRepo.checkIsuserAdmin(payload)
                if (isMember) return res.status(200).send({ message: "Succesfully fetched", success: true, info: information, isMember: isMember, isAdmin: isAdmin })
                return res.status(200).send({ message: "Succesfully fetched", success: true, info: information, isMember: isMember, isAdmin: isAdmin })
            }
            else {
                console.log(2)
                return res.status(200).send({ message: "error occured, retry", success: false })
            }
        } catch (error) {
            console.log(error)
            console.log(3)
            res.status(500).send({ message: "Internal server error", success: false })
        }

    },

    // api for updating profiles
    updateProfilePicture: async (req, res) => {
        try {
            const { id, type, url } = req.body

        } catch (error) {
            res.status(500).send({ message: "Internal server error", success: false })
        }
    },

    // api for posts in home 
    postsInHome: async (req, res) => {
        try {
            const allPosts = await userRepo.getPostsForHome(req.body)

            // ⚠️  ⚠️ ❌ ⚠️  ⚠️
            // commented beacuse of s3 limit

            // const getUrls = (async () => {
            //     for (let i = 0; i < allPosts.length; i++) {
            //         let url = await getSignedUrl(allPosts[i].post.image)  
            //         allPosts[i].url = url 
            //     }
            console.log(allPosts)
            return res.status(200).send({ message: "all posts are fetched", allPosts: allPosts, success: true })
            // })() 

            // ⚠️  ⚠️ ❌ ⚠️  ⚠️  

        } catch (error) {
            return res.status(500).send({ message: "all posts are not fetched", success: false })
        }
    },

    // api for like❤️ post
    likePost: async (req, res) => {
        try {
            console.log(req.body)
            const rslt = await postrepo.likePost(req.body)
            console.log(rslt)
            if (rslt) {
                return res.status(200).send({ message: "liked succesfully", success: true })
            } else {
                return res.status(500).send({ message: "like not success", success: false })
            }
        } catch (error) {
            return res.status(500).send({ message: "error from server", success: false })
        }
    },

    // api for unlike👎 post 
    unlikePost: async (req, res) => {
        try {
            const rslt = await postrepo.unlikePost(req.body)
            console.log("unlike", rslt)
            if (rslt) {
                return res.status(200).send({ message: "unliked succesfully", success: false })
            } else {
                return res.status(500).send({ message: "unlike not succesful", success: false })
            }
        } catch (error) {
            return res.status(500).send({ message: "error from server", success: false })
        }
    },

    // api for deleting post ✂️
    deletePost: async (req, res) => {
        try {
            const reslt = await postrepo.deletePost(req.body).then((response) => {
                if (response.modifiedCount === 1) return res.status(200).send({ message: "Deleted post Succesfully", success: true })
                return res.status(401).send({ message: "can't find the post", success: false })
            })
        } catch (error) {
            console.log(error) 
            return res.status(500).send({ message: "Server error", success: false }) 
        } 
    },

    // api for comment 🔡 
    addAComment: async (req, res) => {
        try {
            console.log("inside control")
            const reslt = await postrepo.addAComment(req.body)
            if (reslt) {
                return res.status(200).send({ message: 'commented', success: true })
            } else {
                console.log("false")
                return res.status(500).send({ message: 'Some error occured', success: false })
            }
        } catch (error) {
            return res.status(500).send({ message: 'Some error occured', success: false })
        }
    },

    //api for delete a comment
    deleteComment: async (req, res) => {
        try {
            await postrepo.deleteComment(req.body.commentId).then((result)=> {
                console.log(result) 
                if(result.modifiedCount === 1) {
                    return res.status(200).send({ message: "comment deleted succesfully", success: true })
                }else{
                    return res.status(401).send({ message: "comment not deleted", success: false }) 
                }
            })
        } catch (error) {
            return res.status(500).send({ message: "Error from the server", success: false, error: error })
        }
    },
    // api for reporting a comment 🚩 
    reportComment: async (req, res) => {
        try {
            await postrepo.reportComment(req.body)
            return res.status(200).send({ message: "comment reported succesfully", success: true })
        } catch (error) {
            return res.status(500).send({ message: "Error from the server", success: false, error: error })
        }
    },

    reportContents: async (req,res) => { 
        try {
            const contents = await postrepo.reportContents()
            console.log(contents)  
            return res.status(200).send({message : "got Contents", contents:contents}) 
        } catch (error) {
           return res.status(500).send({message : "server error"})   
        }
    },



}