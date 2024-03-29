const { UnauthenticatedError } = require("../errors/index");
const checkUserPermission = (
  requestUser: { role: string; userId: string },
  resourceUserId: string
): void => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnauthenticatedError("Not authorized to access this route");
};
module.exports = checkUserPermission;
