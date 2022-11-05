const nodemailer = require('nodemailer');

const sendMail = async (options) => {
  // create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
      user: 'faizanshahid191016@gmail.com',
      pass: 'jnnxpuzxnfwqnscl',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // mail options
  const mailOptions = {
    from: 'CUST EMS <custems@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // send the mail

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
