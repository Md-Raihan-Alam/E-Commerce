import express from "express";
const router = express.Router();
const {
  authneticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  getAllUsers,
  getSingleUser,
  updateUserPassword,
  updateUser,
  showCurrentUser,
} = require("../controllers/userController");
router
  .route("/")
  .get(authneticateUser, authorizePermissions("admin"), getAllUsers);
router.route("/showMe").get(authneticateUser, showCurrentUser);
router.route("/updateUser").patch(authneticateUser, updateUser);
router.route("/updateUserPassword").patch(authneticateUser, updateUserPassword);
router.route("/:id").get(authneticateUser, getSingleUser);
module.exports = router;
