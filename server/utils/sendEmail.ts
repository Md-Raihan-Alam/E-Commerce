import nodemailer from "nodemailer";
const nodeMailerConfig = require("./nodeMailerConfig");
const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> => {
  let transporter = nodemailer.createTransport(nodeMailerConfig);
  let message = {
    from: process.env.EMAIL,
    to,
    subject,
    html,
  };
  transporter.sendMail(message);
};
module.exports = sendEmail;
