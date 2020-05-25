const nodemailer = require('nodemailer');

const { MAIL_SERVICE, MAIL_USER, MAIL_PASS } = process.env;

const transporter = nodemailer.createTransport({
  service: MAIL_SERVICE,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

const sendEmail = (to, subject, html) => {
  try {
    const options = { from: MAIL_USER, to, subject, html };
    transporter.sendMail(options)
  } catch (err) {
    res.json(err.message)
  }

};

module.exports = sendEmail