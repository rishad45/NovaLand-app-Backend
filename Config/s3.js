const { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const { v4: uuidv4 } = require('uuid');

const s3 = new S3Client()
const BUCKET = process.env.BUCKET_NAME

const uploadToS3 = async (file, userId) => {
    const key = `${userId}/${uuidv4()}`
    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
    })

    try {
        await s3.send(command)
        return { key }
    } catch (error) {
        console.log(error)
        return { error }
    }

}


const getImagesByCommunity = async (communityId) => {
    const command = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: communityId
    })

    const { Contents = [] } = await s3.send(command)
    return Contents.map((image) => image.Key)
}

const getCommunityPresignedUrls = async (id) => {
    try {
        const imageKeys = await getImagesByCommunity(id) 
        console.log("image keys =>", imageKeys)
        const preSignedUrls = Promise.all(
            imageKeys.map((key) => {
                const command = new GetObjectCommand({ Bucket: BUCKET, Key: key })
                return getSignedUrl(s3, command, { expiresIn: 900 })
            })
        )
        return preSignedUrls  
    } catch (error) {
        return error
    }
} 

const getImagesBykeys = async (key) => {
    try {
        const command = new GetObjectCommand({Bucket : BUCKET, Key : key}) 
        return getSignedUrl(s3, command, {expiresIn : 900}) 
    } catch (error) {
        return error 
    }
}
module.exports = { uploadToS3, getCommunityPresignedUrls, getImagesBykeys }  