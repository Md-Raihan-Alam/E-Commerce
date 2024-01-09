interface User {
  name: string;
  _id: string;
  role: string;
}
const tokenUserCreated = (
  user: User
): { name: string; userId: string; role: string } => {
  return { name: user.name, userId: user._id, role: user.role };
};
module.exports = tokenUserCreated;
