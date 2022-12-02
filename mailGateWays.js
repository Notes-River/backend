"use strict";
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });
let transporter = nodemailer.createTransport({
    pool: true,
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER, // generated ethereal user
        pass: process.env.MAIL_PASS, // generated ethereal password
    },
});

const sendMail = async (recipents, message) => {
    const res = await transporter.sendMail({ from: "Portfolio Manager", to: recipents.join(", "), ...message, })
    console.log(res)
}


module.exports = { sendMail }