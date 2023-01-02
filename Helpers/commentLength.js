const postRepo = require('../Repositories/postrepo')

const getCommentsLength = async(postId) => {
    console.log("inside helper", postId) 
    const res =  await postRepo.getCommentsLength(postId)  
    console.log(res)  
    return res[0].sum  
}

module.exports = getCommentsLength