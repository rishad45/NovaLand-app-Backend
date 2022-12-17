const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const { v4: uuidv4 } = require('uuid');

const s3 = new S3Client()
const BUCKET = process.env.BUCKET_NAME

const uploadToS3 = async ({ file, userId }) => {
    const key = `${userId}/${uuidv4()}`
    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType : file.mimetype
    })

    try {
        await s3.send(command)
        return {key} 
    } catch (error) {
        console.log(error) 
        return {error}
    }

}

module.exports = uploadToS3 