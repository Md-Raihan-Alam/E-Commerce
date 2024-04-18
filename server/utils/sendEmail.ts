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
  try {
    let transporter = nodemailer.createTransport(nodeMailerConfig);
    let message = {
      from: process.env.EMAIL,
      to,
      subject,
      html,
    };
    console.log("email sent");
    transporter.sendMail(message);
  } catch (error: any) {
    console.log(error);
  }
};
module.exports = sendEmail;
