import express from "express";
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  updateUserPassword,
  updateUser,
  showCurrentUser,
} = require("../controllers/userController");
router.route("/").get(getAllUsers);
router.route("/showMe").post(showCurrentUser);
router.route("/updateUser").patch(updateUser);
router.route("/updateUserPassword").patch(updateUserPassword);
router.route("/:id").get(getSingleUser);
module.exports = router;
