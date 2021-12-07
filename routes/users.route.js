const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const usersController = require("../controllers/users-controller");

router.post(
    "/register",
    [],
    usersController.register
);

router.post(
    "/login",
    [],
    usersController.login
);

module.exports = router;

// usuario: chat
// senha: conecta123
