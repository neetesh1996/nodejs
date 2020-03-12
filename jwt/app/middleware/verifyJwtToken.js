/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const jwt = require("jsonwebtoken");
const config = require("../config/config.js");
const db = require("../config/db.config.js");
const Role = db.role;
const User = db.user;

// eslint-disable-next-line no-undef
verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      auth: false,
      message: "No token provided."
    });
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(500).send({
        auth: false,
        message: "Fail to Authentication. Error -> " + err
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  const token = req.headers["x-access-token"];

  User.findById(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        console.log(roles[i].name);
        if (roles[i].name.toUpperCase() === "ADMIN") {
          next();
          return;
        }
      }

      res.status(403).send("Require Admin Role!");
    });
  });
};

isHrOrAdmin = (req, res, next) => {
  const token = req.headers["x-access-token"];

  User.findById(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name.toUpperCase() === "HR") {
          next();
          return;
        }

        if (roles[i].name.toUpperCase() === "ADMIN") {
          next();
          return;
        }
      }

      res.status(403).send("Require HR or Admin Roles!");
    });
  });
};

const authJwt = {};
authJwt.verifyToken = verifyToken;
authJwt.isAdmin = isAdmin;
authJwt.isHrOrAdmin = isHrOrAdmin;

module.exports = authJwt;
