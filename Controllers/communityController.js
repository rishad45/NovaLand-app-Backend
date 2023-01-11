/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
const { uploadToS3 } = require('../Config/s3');
const getCommunityUrls = require('../Config/s3').getCommunityPresignedUrls;
const getSignedUrl = require('../Config/s3').getImagesBykeys;

const communityRepo = require('../Repositories/communityRepo');
const postRepo = require('../Repositories/postrepo');
const userRepo = require('../Repositories/userRepo');

module.exports = {
  // eslint-disable-next-line consistent-return
  createPost: async (req, res) => {
    const { file } = req;
    console.log(file);
    if (!file) return res.status(400).json({ message: 'No file found', success: false });
    console.log('file is.....', file);
    console.log('id isssss', req.body.id);
    console.log(req.body.communityId);

    const { error, key } = await uploadToS3(file, req.body.communityId);
    if (error) return res.status(500).json({ message: 'Error occured while uploading the file', success: false });
    console.log(key);
    const payload = {
      communityId: req.body.communityId,
      userId: req.body.id,
      image: key,
      description: req.body.description,
      location: req.body.location,
    };
    try {
      const result = await postRepo.createPost(payload);
      console.log('posted and result is', result);
      if (result) {
        const payload2 = {
          communityId: result.communityId,
          postId: result._id,
        };
        const saved = await postRepo.savePostinCommunity(payload2);
        console.log('saved', saved);
        return res.status(200).send({ message: 'uploaded', success: true, result });
      }
    } catch (err) {
      return res.status(500).send({ message: 'error occured', success: false });
    }
  },
  // get images
  getCommunityPostImages: async (req, res) => {
    console.log(1);
    const { communityId } = req.body;
    const urls = await getCommunityUrls(communityId);
    console.log('urls areee', urls);
    return res.status(200).send({ message: 'image fetched', urls, success: true });
  },

  // eslint-disable-next-line consistent-return
  getCommunityPosts: async (req, res) => {
    try {
      let posts;
      console.log(req.body);
      if (req.body.userPosts === true) {
        posts = await communityRepo.userPosts(req.body);
      } else {
        posts = await communityRepo.communityPosts(req.body);
      }
      console.log('posts are', posts);
      const allposts = posts.map((i) => ({
        postId: i._id,
        image: i.image,
      }));

      console.log(allposts);
      // eslint-disable-next-line no-unused-vars
      const getUrls = (async () => {
        for (let i = 0; i < posts.length; i += 1) {
          await getSignedUrl(posts[i].image).then((url) => {
            console.log(url);
            console.log(posts[i]);
            allposts[i].url = url;
            console.log(allposts[i]);
          });
        }
        return res.status(200).send({ message: 'got posts', posts: allposts });
      })();
    } catch (error) {
      return res.status(500).send({ message: 'Server error,Please try Again', success: false });
    }
  },

  // leave from community
  leaveCommunity: async (req, res) => {
    try {
      const result = await communityRepo.leaveCommunity(req.body);
      console.log(result);
      return res.status(200).send({ message: 'Leave succefull', success: true });
    } catch (error) {
      return res.status(500).send({ message: 'Leave unsuccefull', success: false });
    }
  },

  getPostComments: async (req, res) => {
    try {
      const result = await postRepo.getPostComments(req.body);
      const promise = [];
      for (let i = 0; i < result.length; i += 1) {
        promise.push(getSignedUrl(result[i].userDetails.profilePicture));
      }
      const images = await Promise.all(promise);
      for (let i = 0; i < images.length; i += 1) {
        result[i].userImage = images[i];
      }
      console.log('result', result);
      return res.status(200).send({ message: 'Fetched succefully', comments: result, success: true });
    } catch (error) {
      return res.status(500).send({ message: 'Server error,Please try Again', success: false });
    }
  },

  // eslint-disable-next-line consistent-return
  uploadProfile: async (req, res) => {
    try {
      console.log('body', req.body);
      const { file } = req;
      if (!file) return res.status(401).send({ message: 'Image not found', success: false });
      if (req.body.userId !== '') {
        console.log('user found');
        const { error, key } = await uploadToS3(file, req.body?.userId);
        if (error) return res.status(500).json({ message: 'Error occured while uploading the file', success: false });
        let status = false;
        if (req.body?.cover) status = true;
        console.log(status);

        await userRepo.updateProfile(req.body.userId, key, status).then((result) => {
          if (result.modifiedCount === 1) {
            console.log(result);
            return res.status(200).send({ message: 'Profile picture is updated', success: true });
          }
          return res.status(401).send({ message: 'Profile picture is not updated, please try again later', success: false });
        });
      } else {
        console.log('community found');
        const { error, key } = await uploadToS3(file, req.body?.communityId);
        if (error) return res.status(500).json({ message: 'Error occured while uploading the file', success: false });
        let status = false;
        if (req.body?.cover) status = true;
        console.log(status);
        await communityRepo.updateProfile(req.body.communityId, key, status).then((result) => {
          if (result.modifiedCount === 1) {
            console.log(result);
            return res.status(200).send({ message: 'Profile picture is updated', success: true });
          }
          return res.status(401).send({ message: 'Profile picture is not updated, please try again later', success: false });
        });
      }
    } catch (error) {
      return res.status(500).send({ message: 'internal server error, please try again, If this persist, please contact us', success: false });
    }
  },

  // get everything about posts
  getPostInfoById: async (req, res) => {
    try {
      const postInfo = await postRepo.getPostInfo(req.body);
      const comments = await postRepo.getPostComments(req.body);
      return res.status(200).send({
        message: 'Post details are fetched', post: postInfo, comments, success: true,
      });
    } catch (error) {
      return res.status(500).send({ message: 'Server error, Please try again,  If this persist, please contact us', success: false });
    }
  },

};
