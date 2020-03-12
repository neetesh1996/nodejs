
const verifySignUp = require("../middleware/verifySignUp");
const authJwt = require("../middleware/verifyJwtToken");
const db = require("../config/db.config.js");
const User = db.user;
const {
  Container
} = require("typedi");
const {
  celebrate,
  Joi
} = require("celebrate");
const AuthService = require("../services/auth");
const MailerService = require("../services/mailer");

module.exports = function (app) {
  app.post(
    "/signup", [verifySignUp.checkDuplicateUserNameOrEmail],
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        username: Joi.string().required(),
        roles: Joi.array().required(),
        email: Joi.string().required(),
        password: Joi.string().required()
      })
    }),
    async (req, res, next) => {
      console.log("Calling Sign-Up endpoint with body: %o", req.body);
      try {
        const authServiceInstance = Container.get(AuthService);
        await authServiceInstance.SignUp(req.body);
        return res.status(201).json(`user created name:${req.body.name}`);
      } catch (e) {
        console.log(" error: %o", e);
        return next(e);
      }
    }
  );

  app.post(
    "/signin",
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
      })
    }),
    async (req, res, next) => {
      console.log("Calling Sign-In endpoint with body: %o", req.body);
      try {
        const {
          email,
          password
        } = req.body;
        const authServiceInstance = Container.get(AuthService);
        const {
          token
        } = await authServiceInstance.SignIn(
          email,
          password
        );
        console.log("email" + email);
        return res.json({
          token
        }).status(200);
      } catch (e) {
        console.log(" error: %o", e);
        return next(e);
      }
    }
  );
  app.get("/getusers", [authJwt.verifyToken, authJwt.isAdmin],
    async (req, res) => {
      User.findAll().then(user => {
        // Send all employee to Client
        res.json(user);
      });
    }

  );
  app.post(
    "/update/:id", [verifySignUp.checkDuplicateUserNameOrEmail, authJwt.verifyToken, authJwt.isAdmin],
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        username: Joi.string().required(),
        roles: Joi.array().required(),
        email: Joi.string().required(),
        password: Joi.string().required()
      })
    }),
    async (req, res, next) => {
      const id = req.params.id;
      console.log("Calling update endpoint with body: %o", req.body);
      try {
        const authServiceInstance = Container.get(AuthService);
        await authServiceInstance.Update(req.body, id);
        return res.status(201).json(`user updated name:${req.body.name}`);
      } catch (e) {
        console.log(" error: %o", e);
        return next(e);
      }
    }
  );
  app.get("/sendmail", [authJwt.verifyToken],
    async (req, res, next) => {
      try {
        const id = req.userId;
        const user = await User.findOne({
          where: {
            id: id
          }
        });
        const authServiceInstance = Container.get(MailerService);
        await authServiceInstance.SendWelcomeEmail(id);
        return res.json(`mail has been sent from ${user.name} to admin`).status(200);
      } catch (e) {
        console.log(" error: %o", e);
        return next(e);
      }
    }

  );
  app.post("/delete/:id", [authJwt.verifyToken, authJwt.isAdmin],
    async (req, res, next) => {
      try {
        const uid = req.params.id;
        const user = await User.findOne({
          where: {
            id: uid
          }
        });
        const authServiceInstance = Container.get(AuthService);
        await authServiceInstance.Delete(uid);
        return res.json(`user have been deleted ${user.name} `).status(200);
      } catch (e) {
        console.log("error: %o ", e);
        return next(e);
      }
    }

  );
  app.get("/logout", [authJwt.verifyToken], (req, res, next) => {
    try {
      return res.status(200).end();
    } catch (e) {
      return next(e);
    }
  });
};
