import express from "express";
const router = express.Router();
const { authorizePermissions } = require("../middleware/authentication");
const {
  getAllUsers,
  getSingleUser,
  updateUserPassword,
  updateUser,
  showCurrentUser,
} = require("../controllers/userController");
router.route("/").get(authorizePermissions("admin"), getAllUsers);
router.route("/showMe").post(showCurrentUser);
router.route("/updateUser").patch(updateUser);
router.route("/updateUserPassword").patch(updateUserPassword);
router.route("/:id").get(getSingleUser);
module.exports = router;
