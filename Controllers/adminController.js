const bcrypt = require('bcrypt');
const createAccessToken = require('../Config/createAccessTokens');
const createRefreshToken = require('../Config/createRefreshTokens');
const adminRepo = require('../Repositories/adminRepo');

module.exports = {
  createAdmin: async (req, res) => {
    try {
      req.body.password = await bcrypt.hash(req.body.password, 10);
      console.log('body', req.body);
      await adminRepo.createAdmin(req.body);
      return res.status(200).send({ message: 'created new admin' });
    } catch (error) {
      return error;
    }
  },
  // admin login control
  login: async (req, res) => {
    try {
      await adminRepo.login(req.body).then(async (reslt) => {
        console.log(reslt);
        if (reslt) {
          const isMatch = await bcrypt.compare(req.body.password, reslt[0].password);
          if (isMatch) {
            const payload = {
              _id: reslt._id,
              userName: reslt.name,
              email: reslt.email,
            };
            const accessToken = createAccessToken(payload);
            const refreshToken = createRefreshToken(payload);
            // assigning refresh token in a http-only cookie
            res.cookie('refreshToken', refreshToken, {
              httpOnly: true,
              path: '/',
              sameSite: 'strict',
              expiresIn: 24 * 60 * 60 * 1000,
              secure: true,
            });
            // returning the access token
            res.cookie('accessToken', accessToken, {
              httpOnly: true,
              path: '/',
              sameSite: 'strict',
              expiresIn: 60 * 60 * 1000,
              secure: true,
            });
            res.cookie();
            return res.status(200).send({ message: 'Login succesfull', success: true, admin: reslt[0] });
          }
          return res.status(400).send({ message: 'Password Is not correct', success: false });
        }
        return res.status(400).send({ message: 'An admin with this email is not exist', success: false });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: 'Internal server error' });
    }
    return null;
  },

  getAllUsers: async (req, res) => {
    try {
      await adminRepo.getAllusers().then((rslt) => res.status(200).send(
        { success: true, data: rslt },
      ));
    } catch (error) {
      return res.status(500).send({ message: 'Internal server error' });
    }
    return null;
  },

  getAllAdmins: async (req, res) => {
    try {
      await adminRepo.getAllAdmins().then((rslt) => res.status(200).send(
        { success: true, data: rslt },
      ));
    } catch (error) {
      return res.status(500).send({ message: 'Internal server error' });
    }
    return null;
  },
  getAllCommunities: async (req, res) => {
    try {
      await adminRepo.getAllCommunities().then((reslt) => res.status(200).send(
        { success: true, data: reslt },
      ));
    } catch (error) {
      return error;
    }
    return null;
  },

  blockUser: async (req, res) => {
    try {
      await adminRepo.blockUser(req.body.userId).then((reslt) => {
        if (reslt.modifiedCount === 1) {
          return res.status(200).send({ message: 'User is blocked', success: true });
        }
        return res.status(400).send({ message: 'User not blocked, try again', success: false });
      });
    } catch (error) {
      return res.status(500).send({ message: 'Internal server error' });
    }
    return null;
  },

  blockAdmin: async (req, res) => {
    try {
      await adminRepo.blockAdmin(req.body.adminId).then((reslt) => {
        if (reslt.modifiedCount === 1) {
          return res.status(200).send({ message: 'Admin is blocked', success: true });
        }
        return res.status(400).send({ message: 'Admin not blocked, try again', success: false });
      });
    } catch (error) {
      return res.status(500).send({ message: 'Internal server error' });
    }
    return null;
  },

  unblockUser: async (req, res) => {
    try {
      await adminRepo.unblockUser(req.body.userId).then((reslt) => {
        if (reslt.modifiedCount === 1) {
          return res.status(200).send({ message: 'user is unblocked', success: true });
        }
        return res.status(400).send({ message: 'user not unblocked, try again', success: false });
      });
    } catch (error) {
      return res.status(500).send({ message: 'Internal server error' });
    }
    return null;
  },

  unblockAdmin: async (req, res) => {
    try {
      await adminRepo.unblockAdmin(req.body.adminId).then((reslt) => {
        if (reslt.modifiedCount === 1) {
          return res.status(200).send({ message: 'Admin is unblocked', success: true });
        }
        return res.status(400).send({ message: 'Admin not unblocked, try again', success: false });
      });
    } catch (error) {
      return res.status(500).send({ message: 'Internal server error' });
    }
    return null;
  },

  getAllBlockedAdmins: async (req, res) => {
    try {
      await adminRepo.getAllBlockedAdmins().then((reslt) => res.status(200).send({ message: 'fetched succeflly', success: true, data: reslt }));
    } catch (error) {
      return res.status(500).send({ message: 'Internal server error' });
    }
    return null;
  },

  getAllBlockedUsers: async (req, res) => {
    try {
      await adminRepo.getAllBlockedUsers().then((reslt) => res.status(200).send({ message: 'fetched succeflly', success: true, data: reslt }));
    } catch (error) {
      return res.status(500).send({ message: 'Internal server error' });
    }
    return null;
  },

  getAllFlaggedPosts: async (req, res) => {
    try {
      await adminRepo.getAllFlaggedPosts().then((reslt) => res.status(200).send({ message: 'fetched succeflly', success: true, data: reslt }));
    } catch (error) {
      return res.status(500).send({ message: 'Internal server error' });
    }
    return null;
  },

  getTopPosts: async (req, res) => {
    try {
      await adminRepo.getTopPosts().then((rlt) => res.status(200).send({ message: 'fetched succeflly', success: true, data: rlt }));
    } catch (error) {
      return res.status(500).send({ message: 'Internal server error' });
    }
    return null;
  },

  deletePost: async (req, res) => {
    try {
      await adminRepo.deletePost(req.body.postId).then((reslt) => {
        if (reslt.modifiedCount === 1) {
          return res.status(200).send({ message: 'post is deleted', success: true });
        }
        return res.status(400).send({ message: 'post not deleted, try again', success: false });
      });
    } catch (error) {
      return res.status(500).send({ message: 'Internal server error' });
    }
    return null;
  },

  contentForHome: async (req, res) => {
    try {
      const users = await adminRepo.getTotalUsers();
      const posts = await adminRepo.getTotalPosts();
      const communities = await adminRepo.getTotalCommunities();
      return res.status(200).send({
        message: 'successfull', success: true, users, posts, communities,
      });
    } catch (error) {
      return error;
    }
  },

};
