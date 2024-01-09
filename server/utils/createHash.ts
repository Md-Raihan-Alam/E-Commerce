import crypto from "crypto";
const hashString = (string: string) => {
  crypto.createHash("md5").update(string).digest("hex");
};
module.exports = hashString;
