const sendEmail = require("./sendEmail");
import Mailgen from "mailgen";
const sendResetPasswordEmail = async ({
  name,
  email,
  token,
  origin,
}: {
  name: string;
  email: string;
  token: string;
  origin: string;
}): Promise<void> => {
  const resetURL = `${origin}user/reset-password?token=${token}&email=${email}`;
  const mailTemplate = {
    body: {
      name: name,
      intro:
        "You are receving this email because you have reqeusted a password reset.",
      action: {
        instructions: "To reset you password, please click the button below.",
        button: {
          color: "#DC4D2F",
          text: "Reset Password",
          link: `${resetURL}`,
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
    subject: "Reset Password",
    html: emailBody,
  });
};
module.exports = sendResetPasswordEmail;
