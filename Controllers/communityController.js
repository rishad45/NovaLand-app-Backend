const uploadToS3 = require('../Config/s3').uploadToS3
const getCommunityUrls = require('../Config/s3').getCommunityPresignedUrls
const getSignedUrl = require('../Config/s3').getImagesBykeys

const communityRepo = require('../Repositories/communityRepo')
const postRepo = require('../Repositories/postrepo')
const { post } = require('../routes/userRouter')
module.exports = {
    createPost: async (req, res) => {
        const { file } = req
        console.log(file)
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
                    communityId: result.communityId,
                    postId: result._id
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

    getCommunityPosts: async (req, res) => {
        try {
            console.log(req.body)
            const posts = await communityRepo.communityPosts(req.body)
            console.log("posts are", posts) 
            const allposts = posts.map((i) => {
                return {
                    postId: i._id,
                    image: i.image
                }
            })
            console.log(allposts)
            let promises = []
            const getUrls = (async () => {
                for (let i = 0; i < posts.length; i++) {
                    await getSignedUrl(posts[i].image).then((url) => {
                        console.log(url)
                        console.log(posts[i])
                        allposts[i].url = url
                        console.log(allposts[i])
                    })
                }
                return res.status(200).send({ message: 'got posts', posts: allposts })

            })()
        } catch (error) {
            return res.status(500).send({ message: "Server error,Please try Again", success: false })
        }
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

    getPostComments: async (req, res) => {
        try {
            const result = await postRepo.getPostComments(req.body)
            console.log("result", result)
            return res.status(200).send({ message: "Fetched succefully", comments: result, success: true })
        } catch (error) {
            return res.status(500).send({ message: "Server error,Please try Again", success: false })
        }
    },

    uploadProfile: async (req, res) => {
        try {
            const { file } = req
            if (!file) return res.status(401).send({ message: "Image not found", success: false })
            const { error, key } = await uploadToS3(file, req.body?.communityId)
            if (error) return res.status(500).json({ message: "Error occured while uploading the file", success: false })
            let status = false
            if (req.body?.cover) status = true
            console.log(status)
            await communityRepo.updateProfile(req.body.communityId, key, status).then((result) => {
                if (result.modifiedCount === 1) {
                    console.log(result)
                    return res.status(200).send({ message: "Profile picture is updated", success: true })
                } else {
                    return res.status(401).send({ message: "Profile picture is not updated, please try again later", success: false })
                }
            })
        } catch (error) {
            return res.status(500).send({ message: "internal server error, please try again, If this persist, please contact us", success: false })
        }
    },

    // get everything about posts
    getPostInfoById : async (req,res) => {
        try {
            const postInfo = await postRepo.getPostInfo(req.body)
            const comments = await postRepo.getPostComments(req.body)
            return res.status(200).send({message : "Post details are fetched", post : postInfo, comments : comments, success : true})  
        } catch (error) {
            return res.status(500).send({message : "Server error, Please try again,  If this persist, please contact us", success : false})
        }
    }

}