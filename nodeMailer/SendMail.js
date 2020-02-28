const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shailesh.vekariya.sa@gmail.com',
    pass: 'shailesh@1solution'
  }
});

// Send Mail Function Using To Otp Register And User Register
function sendMail(mailOptions,callback) {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("MAIL SEND ERROR");
      return null;
    } else {
      console.log(info.response);
      return callback('Email Sent:' + info.response);
    }
  });
}

module.exports=sendMail;