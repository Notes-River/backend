const nodemailer = require('nodemailer');
let mailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: '************',
        pass: '************', // generated ethereal password
    },
});

module.exports = {
    mailTransporter
}