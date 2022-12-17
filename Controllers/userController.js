// repositories
const communityRepo = require('../Repositories/communityRepo')
const userRepo = require('../Repositories/userRepo')

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
    }


}