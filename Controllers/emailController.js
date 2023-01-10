const transporter = require('../Config/nodemailer');
const createOTP = require('../Config/createOTPtoken');
const userRepo = require('../Repositories/userRepo');
const createEmailContent = require('../Helpers/forgotpassText');

module.exports = {
  sendWelcomeEmail: async (req, res) => {
    const text = 'Welcome to NovaLand, Enjoy the feast';
    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.receiver,
      subject: 'welcome onboard',
      text,
    };

    transporter.sendMail(mailOptions, (err, data) => {
      // eslint-disable-next-line no-unused-expressions
      err
        ? console.log(`Error${err}`)
        : console.log(`Email send succesfully${data}`);
    });
    res.status(200).send({ message: 'email send succesfully', success: true });
  },

  // otp
  sendOTP: async (req, res) => {
    try {
      // verify email
      await userRepo.checkEmail(req.body.resetEMAIL).then((result) => {
        if (result) {
          const token = createOTP(req.body.resetEMAIL);
          console.log('token', token);
          const payload = {
            userName: result.userName,
          };
          const text = createEmailContent(payload);
          const url = `${process.env.PASSWORD_RESET_LINK}?token=${token}&email=${req.body.resetEMAIL}`;
          console.log(url);
          const mailOptions = {
            from: process.env.EMAIL,
            to: result.email,
            subject: 'Link to reset your password of NovaLand Account',
            html: `<p>${text}</p><br/><a target='_blank' href=${url}>Password Reset Link</a>`,
          };
          console.log(text);
          console.log(mailOptions);
          transporter.sendMail(mailOptions, (err, data) => {
            // eslint-disable-next-line no-unused-expressions
            err
              ? console.log(`Error${err}`)
              : console.log(`Email send succesfully${data}`);
          });
          return res.status(200).send({ messge: 'Password reset link is send in to your email', stastus: true, token });
        }
        return res.status(400).send({ message: 'Email is not verified by us, Ensure this is the email that is linked with your account', success: false });
      });
    } catch (error) {
      return res.status(500).send({ message: 'Email not send', success: false });
    }
    return null;
  },
};
