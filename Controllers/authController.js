/* eslint-disable no-underscore-dangle */
// modules
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const webPush = require('web-push');

// Repositories
const userRepo = require('../Repositories/userRepo');
const authRepo = require('../Repositories/authRepo');
// custom modules
const createAccessToken = require('../Config/createAccessTokens');
const createRefreshToken = require('../Config/createRefreshTokens');
const verifyGoogleToken = require('../Config/googleVerify');

const getSignedUrl = require('../Config/s3').getImagesBykeys;

module.exports = {
  // user signup request
  userSignup: async (req, res) => {
    try {
      console.log(req.body);
      const isUserExist = await userRepo.checkUsername(req.body.userName);
      const isEmailExist = await userRepo.checkEmail(req.body.email);
      if (isUserExist) {
        res.status(200).send({ message: 'Username is already been taken', success: false });
      } else if (isEmailExist) {
        res.status(200).send({ message: 'Email has already been taken', success: false });
      } else {
        const { password } = req.body;
        req.body.password = await bcrypt.hash(password, 10);
        let payload;
        await authRepo.createAccount(req.body).then((reslt) => {
          console.log('this is the most imp check', reslt);
          payload = {
            _id: reslt._id,
            userName: reslt.userName,
            email: reslt.email,
          };
          console.log('again this also', payload);
        });
        // create access token
        const accessToken = createAccessToken(payload);
        // create refresh token
        const refreshToken = createRefreshToken(payload);
        // send cookie
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          path: '/',
          sameSite: 'strict',
          expiresIn: 25 * 60 * 60 * 1000,
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
        // returning the access token
        return res.json({ accessToken, success: true });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: 'Error in the server..please try again', success: false });
    }
    return null;
  },

  // user login request
  // eslint-disable-next-line consistent-return
  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userRepo.checkEmail(email);
      if (user !== null) {
        console.log(user);
        const isPasswordmatch = await bcrypt.compare(password, user.password);
        if (isPasswordmatch) {
          // create a access token
          const accessToken = createAccessToken(user);

          // create a refresh token
          const refreshToken = createRefreshToken(user);

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
          user.url = getSignedUrl(user.profilePicture);
          return res.json({ success: true, user });
          // eslint-disable-next-line no-else-return
        } else {
          res.status(200).send({ message: 'Incorrect password ! try again', success: false });
        }
      } else {
        console.log('no user ');
        return res.status(200).send({ message: 'No user in this email', success: false });
      }
    } catch (err) {
      return res.status(200).send({ message: 'some error occured', success: false });
    }
  },

  // refresh token request
  refresh: async (req, res) => {
    if (req.cookies?.refreshToken) {
      const { refreshToken } = req.cookies;
      // console.log("here iam")
      console.log('refresh', refreshToken);
      console.log('refresh end');
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
        (err, encoded) => {
          if (err) {
            // wrong refresh token
            console.log('iam wrong');
            return res.status(403).send({ message: 'Unauthorized' });
          }
          // correct token so we send a new access token
          console.log('iam right');
          const { id, userName, email } = encoded;
          console.log(userName);

          const accessToken = jwt.sign({
            id,
            userName,
            email,
          }, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '1m',
          });
          console.log(accessToken);
          res.cookie('accessToken', accessToken, {
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
            expiresIn: 60 * 1000,
            secure: true,
          });
          return res.status(200).send({ message: 'new accessToken is set', accessToken });
        },
      );
    } else {
      res.status(403).send({ message: 'Unauthorized' });
    }
  },

  // verify Auth
  verifyAuth: async (req, res) => {
    const { id, userName, email } = req.body;
    console.log('id is a', id);
    console.log('username is x', userName);
    const user = await userRepo.getuser(email);
    console.log('user is', user);
    const userImage = await getSignedUrl(user.profilePicture);
    if (user) {
      res.status(200).send({
        message: 'Authenticated user',
        success: true,
        user: {
          id: user._id,
          userName: user.userName,
          email: user.email,
          bio: user.bio,
          profile: userImage,
        },
      });
    } else {
      res.status(200).send({ message: 'user authentication error', success: false });
    }
  },

  logout: async (req, res) => {
    try {
      console.log(req.body);
      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');
      return res.status(200).send({ message: 'logged out' });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: 'server error' });
    }
  },

  // google authentication
  googleSignup: async (req, res) => {
    try {
      if (req.body.credential) {
        const verificationResponse = await verifyGoogleToken(req.body.credential);

        if (verificationResponse.error) {
          return res.status(400).send({ message: verificationResponse.error });
        }
        const profile = verificationResponse.payload;
        console.log('profile is', profile);
        await authRepo.createAccountWithgoogle(profile)
          .then((result) => {
            console.log('result from back', result);
            const user = {
              userName: result.userName,
              email: result.email,
              _id: result._id,
            };
            // create access token
            const accessToken = createAccessToken(user);
            // create refresh token
            const refreshToken = createRefreshToken(user);
            // send cookie
            res.cookie('refreshToken', refreshToken, {
              httpOnly: true,
              path: '/',
              sameSite: 'strict',
              expiresIn: 25 * 60 * 60 * 1000,
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
            console.log(accessToken);
            console.log(refreshToken);
            // returning the access token
            return res.json({ accessToken, success: true });
          });
      }
    } catch (error) {
      res.status(500).send({ message: 'An error occured, Registration failed' });
    }
    return null;
  },
  userLoginwithGoogle: async (req, res) => {
    try {
      console.log(req.body.credential);
      if (req.body.credential) {
        const verificationResponse = await verifyGoogleToken(req.body.credential);
        if (verificationResponse.error) {
          return res.status(400).send({ message: verificationResponse.error });
        }
        const profile = verificationResponse?.payload;
        await userRepo.checkEmail(profile?.email).then((result) => {
          if (result && result?.google) {
            const user = {
              userName: result.userName,
              email: result.email,
              _id: result._id,
            };
            // create access token
            const accessToken = createAccessToken(user);
            // create refresh token
            const refreshToken = createRefreshToken(user);
            // send cookie
            res.cookie('refreshToken', refreshToken, {
              httpOnly: true,
              path: '/',
              sameSite: 'strict',
              expiresIn: 25 * 60 * 60 * 1000,
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
            console.log(accessToken);
            console.log(refreshToken);
            // returning the access token
            return res.json({ accessToken, success: true, user });
          }
          return res.status(400).send({ message: 'User not found, signup if you have not created an account before' });
        });
      }
    } catch (error) {
      return res.status(500).send({ message: 'serevr error , please try again', success: true });
    }
    return null;
  },
  // verify token
  verifyToken: async (req, res) => {
    try {
      console.log('token is ', req.body.token);
      jwt.verify(
        req.body.token,
        process.env.JWT_OTP_SECRET,
        (err, decoded) => {
          console.log(decoded);
          if (err) return res.status(400).send({ message: 'Invalid token', success: false });
          return res.status(200).send({ message: 'Token verified', success: true });
        },
      );
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: 'Serer error , please try again , If this persist please contact us', success: false });
    }
    return null;
  },

  // change password
  changePassword: async (req, res) => {
    try {
      console.log(req.body);
      const password = await bcrypt.hash(req.body.password, 10);
      console.log(password);
      req.body.newPassword = password;
      await userRepo.changePassword(req.body);
      return res.status(200).send({ message: 'Password changed', success: true });
    } catch (error) {
      return res.status(500).send({ message: 'Server error', success: false });
    }
  },

  subscribe: async (req, res) => {
    try {
      console.log('bdd', req.body);
      const newSubscription = await authRepo.subscribe(req.body);
      console.log('new subscription', newSubscription);
      const options = {
        vapidDetails: {
          subject: 'mailto:45rishadricu@gmail.com',
          publicKey: process.env.VAPID_PUBLIC_KEY,
          privateKey: process.env.VAPID_PRIVATE_KEY,
        },
      };
      await webPush.sendNotification(
        newSubscription,
        JSON.stringify({
          title: 'Hello from NovaLand',
          description: 'this message is coming from the server',
          image: 'https://cdn2.vectorstock.com/i/thumb-large/94/66/emoji-smile-icon-symbol-smiley-face-vector-26119466.jpg',
        }),
        options,
      );
      res.sendStatus(200);
    } catch (error) {
      return res.status(500).send({ error });
    }
    return null;
  },
};
