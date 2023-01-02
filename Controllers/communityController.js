const uploadToS3 = require('../Config/s3').uploadToS3
const getCommunityUrls = require('../Config/s3').getCommunityPresignedUrls

const communityRepo = require('../Repositories/communityRepo')
const postRepo = require('../Repositories/postrepo')
module.exports = {
    createPost: async (req, res) => {
        const { file } = req
        if (!file) return res.status(400).json({ message: "No file found", success: false })
        console.log("file is.....", file)
        console.log("id isssss", req.body.id)
        console.log(req.body.communityId)
        const { error, key } = await uploadToS3(file, req.body.communityId)
        if (error) return res.status(500).json({ message: "Error occured while uploading the file", success: false })
        console.log(key)
        const payload = {
            communityId: req.body.communityId,
            userId: req.body.id,
            image: key,
            description: req.body.description,
            location: req.body.location
        }
        try {
            const result = await postRepo.createPost(payload)
            console.log("posted and result is", result)
            if (result) { 
                const payload = {
                    communityId : result.communityId,
                    postId : result._id
                }
                const saved = await postRepo.savePostinCommunity(payload) 
                console.log("saved", saved) 
                return res.status(200).send({ message: "uploaded", success: true })
            }
        } catch (error) {
            return res.status(500).send({ message: "error occured", success: false })
        }
    },
    // get images
    getCommunityPostImages: async (req, res) => {
        console.log(1)
        const { communityId } = req.body
        const urls = await getCommunityUrls(communityId)
        console.log("urls areee", urls)
        return res.status(200).send({ message: "image fetched", urls: urls, success: true })
    },

    // leave from community
    leaveCommunity: async (req, res) => {
        try {
            const result = await communityRepo.leaveCommunity(req.body)
            console.log(result)
            return res.status(200).send({ message: "Leave succefull", success: true })
        } catch (error) {
            return res.status(500).send({ message: "Leave unsuccefull", success: false })
        }
    },

    getPostComments : async(req,res) => {
        try {
            const result = await postRepo.getPostComments(req.body) 
            console.log("result", result) 
            return res.status(200).send({message : "Fetched succefully", comments : result, success : true}) 
        } catch (error) {
            return res.status(500).send({message : "Server error,Please try Again", success : false}) 
        }
    }
}