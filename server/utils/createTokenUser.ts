interface User {
  name: string;
  _id: string;
  role: string;
  address: string;
  image: string;
}
const tokenUserCreated = (
  user: User
): {
  name: string;
  userId: string;
  role: string;
  address: string;
  image: string;
} => {
  return {
    name: user.name,
    userId: user._id,
    role: user.role,
    address: user.address,
    image: user.image,
  };
};
module.exports = tokenUserCreated;
