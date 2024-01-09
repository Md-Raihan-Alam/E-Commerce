const sendEmail = require("./sendEmail");
import Mailgen from "mailgen";
const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}: {
  name: string;
  email: string;
  verificationToken: string;
  origin: string;
}): Promise<void> => {
  const verifyEmail = `${origin}user/verify-email?token=${verificationToken}&email=${email}`;
  const mailTemplate = {
    body: {
      name: name,
      intro: "Welcome to Book Shop! We are excited to have you board",
      action: {
        instructions: "To verify your account, please click the button",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: `${verifyEmail}`,
        },
      },
      outro: "If you are not the one who requested it, then ignore it",
    },
  };
  let mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js/",
    },
  });
  const emailBody = mailGenerator.generate(mailTemplate);
  return sendEmail({
    to: email,
    subject: "Email Verification",
    html: emailBody,
  });
};
module.exports = sendVerificationEmail;
