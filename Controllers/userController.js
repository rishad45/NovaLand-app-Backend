/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
// repositories
const communityRepo = require('../Repositories/communityRepo');
const postrepo = require('../Repositories/postrepo');
const userRepo = require('../Repositories/userRepo');

const getSignedUrl = require('../Config/s3').getImagesBykeys;

module.exports = {
  // api for creating community
  createCommunity: async (req, res) => {
    try {
      console.log('inside here');
      console.log(req.body);
      const comm = await communityRepo.createCommunity(req.body);
      console.log('is saved', comm);
      if (comm != null) {
        res.status(200).send({ message: 'umm', success: true });
      } else {
        res.status(200).send({ message: 'Cannot create a community', success: false });
      }
    } catch (error) {
      res.status(500).send({ message: 'server error', success: false });
    }
  },
  // api for getting recommended communities
  getRecommendedCommunities: async (req, res) => {
    try {
      const { id } = req.body;
      const communities = await communityRepo.getRecommendedCommunities(id);
      console.log(communities);
      const promises = [];
      for (let i = 0; i < communities.length; i += 1) {
        if (communities[i].profilePicture === null || communities[i].profilePicture === '' || communities[i].profilePicture === undefined) {
          promises.push(getSignedUrl('default/679060d15d1dbd809ff81fe1cbe60748.jpg'));
        } else {
          promises.push(getSignedUrl(communities[i].profilePicture));
        }
      }
      const images = await Promise.all(promises);
      for (let i = 0; i < images.length; i += 1) {
        communities[i].image = images[i];
      }
      res.status(200).send({ message: 'fetched succesfully', success: true, data: communities });
    } catch (error) {
      res.status(500).send({ message: 'fetch unsucceful', success: false, communities: null });
    }
  },
  // api for getting user communities
  getUserCommunities: async (req, res) => {
    console.log('body', req.body);
    try {
      const { id } = req.body;
      const communities = await communityRepo.getUserCommunities(id);

      console.log(communities);
      const promises = [];
      for (let i = 0; i < communities.length; i += 1) {
        console.log(communities[i].profilePicture);
        if (communities[i].profilePicture === null || communities[i].profilePicture === '' || communities[i].profilePicture === undefined) {
          promises.push(getSignedUrl('default/679060d15d1dbd809ff81fe1cbe60748.jpg'));
        } else {
          promises.push(getSignedUrl(communities[i].profilePicture));
        }
      }
      const images = await Promise.all(promises);
      for (let i = 0; i < images.length; i += 1) {
        communities[i].image = images[i];
      }
      console.log(communities);
      res.status(200).send({ message: 'fetched succesfully', success: true, data: communities });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'fetch unsucceful', success: false, communities: null });
    }
  },
  // api for getting all communities
  getAllCommunities: async (req, res) => {
    try {
      const communities = await communityRepo.getAllCommunities();
      console.log(communities);
      if (communities.length === 0) {
        res.status(200).send({ message: 'fetched succesfully', success: true, data: null });
      } else {
        res.status(200).send({ message: 'fetched succesfully', success: true, data: communities });
      }
    } catch (error) {
      res.status(500).send({ message: 'server error', success: false });
    }
  },

  // api for joining request in communities
  joinInCommunity: async (req, res) => {
    try {
      // api will get userId and community Id
      const { communityId } = req.body;
      console.log('req body', req.body);
      // get community
      const curr = await communityRepo.getCommunityById(communityId);
      console.log('commun', curr);
      if (curr.privacy === 'Private') {
        // private ac
        const data = await communityRepo.joinInPrivateCommunity(req.body);
        if (data) {
          res.status(200).send({ message: `Succesfully joined in ${curr.name}`, success: true });
        }
      } else {
        // public ac
        const data = await communityRepo.joinInPublicCommunity(req.body);
        console.log('last data', data);
        if (data) {
          res.status(200).send({ message: `Succesfully joined in ${curr.name}`, success: true, user: req.body.userName });
        }
      }
      // test
      // res.status(200).send({ message: `Succesfully joined in ${curr.name}`, success: true })
    } catch (error) {
      res.status(500).send({ message: 'Join request is failed', success: false });
    }
  },

  // api for getting community info by id
  // eslint-disable-next-line consistent-return
  getCommunityInfoById: async (req, res) => {
    try {
      const { communityId, id } = req.body;
      const information = await communityRepo.getCommunityInfo(communityId);
      if (information) {
        console.log('info', information);
        const payload = {
          userId: id,
          communityId,
        };
        const isMember = await communityRepo.checkUserinCommunity(payload);
        const isAdmin = await communityRepo.checkIsuserAdmin(payload);
        let profile = null;
        let cover = null;
        console.log('mm?', information[0].profilePicture);
        if (information[0].profilePicture !== '') {
          profile = await getSignedUrl(information[0].profilePicture);
          console.log('profile', profile);
        } else {
          profile = 'https://i.pinimg.com/564x/67/90/60/679060d15d1dbd809ff81fe1cbe60748.jpg';
        }

        if (information[0]?.coverPicture) {
          cover = await getSignedUrl(information[0]?.coverPicture);
          console.log('cover', cover);
        } else {
          cover = 'https://i.pinimg.com/564x/ce/52/3e/ce523e25a1a32db94b258348d960fdb5.jpg';
        }
        if (isMember) {
          return res.status(200).send({
            message: 'Succesfully fetched', success: true, info: information, isMember, isAdmin, profile, cover,
          });
        }
        return res.status(200).send({
          message: 'Succesfully fetched', success: true, info: information, isMember, isAdmin, profile, cover,
        });
      }

      console.log(2);
      return res.status(200).send({ message: 'error occured, retry', success: false });
    } catch (error) {
      console.log(error);
      console.log(3);
      res.status(500).send({ message: 'Internal server error', success: false });
    }
  },

  // api for posts in home
  postsInHome: async (req, res) => {
    try {
      const allPosts = await userRepo.getPostsForHome(req.body);
      console.log('allPosts are', allPosts);
      // fetching url of community images
      const promises = [];
      for (let i = 0; i < allPosts.length; i += 1) {
        promises.push(getSignedUrl(allPosts[i].communityDetails.profilePicture));
      }
      const urls = await Promise.all(promises);
      for (let i = 0; i < urls.length; i += 1) {
        allPosts[i].communityDp = urls[i];
      }
      // ⚠️  ⚠️ ❌ ⚠️  ⚠️
      // commented beacuse of s3 limit
      const profilePromises = [];
      for (let i = 0; i < allPosts.length; i += 1) {
        profilePromises.push(getSignedUrl(allPosts[i].post.image));
      }
      const postImages = await Promise.all(profilePromises);
      for (let i = 0; i < postImages.length; i += 1) {
        allPosts[i].url = postImages[i];
      }
      return res.status(200).send({ message: 'all posts are fetched', allPosts, success: true });
      // ⚠️  ⚠️ ❌ ⚠️  ⚠️
    } catch (error) {
      return res.status(500).send({ message: 'all posts are not fetched', success: false });
    }
  },

  // api for like❤️ post
  likePost: async (req, res) => {
    try {
      console.log(req.body);
      const rslt = await postrepo.likePost(req.body);
      console.log(rslt);
      if (rslt) {
        return res.status(200).send({ message: 'liked succesfully', success: true });
      }
      return res.status(500).send({ message: 'like not success', success: false });
    } catch (error) {
      return res.status(500).send({ message: 'error from server', success: false });
    }
  },

  // api for unlike👎 post
  unlikePost: async (req, res) => {
    try {
      const rslt = await postrepo.unlikePost(req.body);
      console.log('unlike', rslt);
      if (rslt) {
        return res.status(200).send({ message: 'unliked succesfully', success: false });
      }
      return res.status(500).send({ message: 'unlike not succesful', success: false });
    } catch (error) {
      return res.status(500).send({ message: 'error from server', success: false });
    }
  },

  // api for deleting post ✂️
  // eslint-disable-next-line consistent-return
  deletePost: async (req, res) => {
    try {
      await postrepo.deletePost(req.body).then((response) => {
        if (response.modifiedCount === 1) return res.status(200).send({ message: 'Deleted post Succesfully', success: true });
        return res.status(401).send({ message: "can't find the post", success: false });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: 'Server error', success: false });
    }
  },

  // api for comment 🔡
  addAComment: async (req, res) => {
    try {
      console.log('inside control');
      const reslt = await postrepo.addAComment(req.body);
      if (reslt) {
        return res.status(200).send({ message: 'commented', success: true });
      }
      console.log('false');
      return res.status(500).send({ message: 'Some error occured', success: false });
    } catch (error) {
      return res.status(500).send({ message: 'Some error occured', success: false });
    }
  },

  // api for delete a comment
  // eslint-disable-next-line consistent-return
  deleteComment: async (req, res) => {
    try {
      await postrepo.deleteComment(req.body.commentId).then((result) => {
        console.log(result);
        if (result.modifiedCount === 1) {
          return res.status(200).send({ message: 'comment deleted succesfully', success: true });
        }
        return res.status(401).send({ message: 'comment not deleted', success: false });
      });
    } catch (error) {
      return res.status(500).send({ message: 'Error from the server', success: false, error });
    }
  },
  // api for reporting a comment 🚩
  reportComment: async (req, res) => {
    try {
      await postrepo.reportComment(req.body).then((result) => {
        if (result.modifiedCount === 1) return res.status(200).send({ message: 'comment reported succesfully', success: true });
        return res.status(401).send({ message: 'comment reported error', success: false });
      });
    } catch (error) {
      return res.status(500).send({ message: 'Error from the server', success: false, error });
    }
  },

  reportPost: async (req, res) => {
    try {
      console.log('body', req.body);
      await postrepo.reportPost(req.body).then((result) => {
        console.log('res', result);
        if (result.modifiedCount === 1) return res.status(200).send({ message: 'post reported succesfully', success: true });
        return res.status(401).send({ message: 'post reported error', success: false });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: 'Error from the server', success: false, error });
    }
  },

  // api for like comment
  likeComment: async (req, res) => {
    try {
      await postrepo.likeComment(req.body).then((result) => {
        if (result.modifiedCount === 1) return res.status(200).send({ message: 'comment liked', success: true });
        return res.status(401).send({ message: 'comment not liked ', success: false });
      });
    } catch (error) {
      return res.status(500).send({ message: 'server error', success: false });
    }
  },
  unlikeComment: async (req, res) => {
    try {
      await postrepo.unlikeComment(req.body).then((result) => {
        if (result.modifiedCount === 1) return res.status(200).send({ message: 'comment unliked', success: true });
        return res.status(401).send({ message: 'comment not unliked ', success: false });
      });
    } catch (error) {
      return res.status(500).send({ message: 'server error', success: false });
    }
  },

  reportContents: async (req, res) => {
    try {
      const contents = await postrepo.reportContents();
      console.log(contents);
      return res.status(200).send({ message: 'got Contents', contents });
    } catch (error) {
      return res.status(500).send({ message: 'server error' });
    }
  },

  // api to check post is saved or not
  isPostSaved: async (req, res) => {
    try {
      console.log('body', req.body);
      const isSaved = await postrepo.isSaved(req.body);
      return res.status(200).send({ saved: isSaved });
    } catch (error) {
      console.log(error);
      return res.status(500);
    }
  },
  // api to save post
  savePost: async (req, res) => {
    try {
      console.log('body', req.body);
      await postrepo.savePost(req.body).then((result) => {
        console.log(result);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: 'server error', success: false });
    }
  },
  // api to unsave post
  unsavePost: async (req, res) => {
    try {
      await postrepo.unsavePost(req.body);
      return res.status(200).send({ message: 'post is unsaved', success: true });
    } catch (error) {
      return res.status(500).send({ message: 'server error', success: true });
    }
  },

  getUserInfo: async (req, res) => {
    try {
      const details = {};
      await userRepo.getUserCommunityNumbers(req.body.id).then((result) => {
        if (result) {
          details.communityCount = result[0]?.total;
        } else {
          details.communityCount = 0;
        }
      });

      await userRepo.getUserPostCount(req.body.id).then((count) => {
        details.postCount = count;
      });

      await userRepo.getuser(req.body.email).then(async (info) => {
        console.log('mm..info', info);
        if (info.profilePicture) {
          console.log(1);
          details.profile = await getSignedUrl(info.profilePicture);
        } else {
          console.log(11);
          details.profile = 'https://i.pinimg.com/564x/67/90/60/679060d15d1dbd809ff81fe1cbe60748.jpg';
        }

        if (info.coverPicture) {
          console.log(2);
          details.cover = await getSignedUrl(info.coverPicture);
        } else {
          console.log(22);
          details.cover = 'https://i.pinimg.com/564x/ce/52/3e/ce523e25a1a32db94b258348d960fdb5.jpg';
        }
      });
      console.log('payload', details);
      return res.status(200).send({ message: 'User details are fetched', details, success: true });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: 'Server error, If this persist please contact us', success: false });
    }
  },

  getUserProfilepic: async (req, res) => {
    try {
      await userRepo.getProfile(req.body.id).then(async (result) => {
        console.log(result);
        if (result?.profilePicture) {
          console.log(1);
          const image = await getSignedUrl(result?.profilePicture);
          console.log(image);
          return res.status(200).send({ message: 'got profile picture', profile: image });
        }
        const image = 'https://i.pinimg.com/564x/67/90/60/679060d15d1dbd809ff81fe1cbe60748.jpg';
        return res.status(200).send({ message: 'got profile', profile: image });
      });
    } catch (error) {
      return res.status(500).send({ message: 'server error' });
    }
  },

  editUserProfile: async (req, res) => {
    try {
      console.log('pay', req.body);

      const errorMessage = {
        nameError: '',
        bioError: '',
      };

      if (req.body?.newUser) {
        console.log('username edit');
        await userRepo.editUsername(req.body.newUser, req.body.id).then((result) => {
          errorMessage.nameError = result;
        });
        res.clearCookie('accessToken');
      }

      if (req.body?.newBio) {
        console.log('bio edit');
        await userRepo.editUserBio(req.body.newBio, req.body.id).then((result) => {
          errorMessage.bioError = result;
        });
      }
      return res.status(200).send({ message: 'Your profile is updated', success: true, errorMessage });
    } catch (error) {
      return res.status(500).send({ message: 'Server error, cannot update the profile right now', success: false });
    }
  },

  search: async (req, res) => {
    try {
      console.log(req.body);
      const result = await userRepo.search(req.body.key);
      const promises = [];
      for (let i = 0; i < result.length; i += 1) {
        console.log(1);
        if (result[i].profilePicture === null || result[i].profilePicture === '' || result[i].profilePicture === undefined) {
          promises.push(getSignedUrl('default/679060d15d1dbd809ff81fe1cbe60748.jpg'));
        } else {
          promises.push(getSignedUrl(result[i].profilePicture));
        }
      }
      const images = await Promise.all(promises);
      for (let i = 0; i < result.length; i += 1) {
        result[i].image = images[i];
      }
      console.log(result);
      return res.status(200).send({ result });
    } catch (error) {
      console.log(error);
      return res.status(500);
    }
  },

};
