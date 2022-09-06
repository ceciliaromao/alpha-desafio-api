const express = require("express");
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require("../controller");

const router = express();

router.get("/users", getUsers);
router.get("/user/:id", getUserById);
router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

module.exports = router;
