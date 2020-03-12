
const config = require("../config/config");
const db = require("../config/db.config.js");
const userModel = require("../model/user.model");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");

var bcrypt = require("bcryptjs");

class AuthService {
  async SignUp (userModel) {
    try {
      const hashedPassword = await bcrypt.hashSync(userModel.password);
      const userRecord = await User.create({
        ...userModel,
        password: hashedPassword
      }).then(userRecord => {
        Role.findAll({
          where: {
            name: {
              [Op.or]: userModel.roles
            }
          }
        }).then(roles => {
          userRecord.setRoles(roles);
        });
      });
      console.log("roles" + userModel.roles);
      if (!userModel) {
        throw new Error("User cannot be created");
      }
      return { userRecord, userModel };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async SignIn (email, password) {
    const user = await User.findOne(
      {
        where: {
          email: email
        }
      });
    console.log("userrecord " + email + user);
    if (!user) {
      throw new Error("User not registered");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      const token = this.generateToken(user);
      return { user, token };
    } else {
      throw new Error("Invalid Password");
    }
  }

  generateToken (user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        id: user.id,
        role: user.role,
        name: user.name,
        exp: exp.getTime() / 1000
      },
      config.jwtSecret
    );
  }

  async Update (user, id) {
    try {
      const uid = id;
      const hashedPassword = await bcrypt.hashSync(user.password);
      const userRecord = await User.update({
        ...user,
        password: hashedPassword
      }, { where: { id: uid } }).then(userRecord => {
        Role.findAll({
          where: {
            name: {
              [Op.or]: userModel.roles
            }
          }
        }).then(roles => {
          userRecord.setRoles(roles);
        });
      });
      if (!user) {
        throw new Error("User cannot be updated");
      }
      return { userRecord, user };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async Delete (id) {
    const uid = id;
    User.destroy({
      where: { id: uid }
    });
  }
}

module.exports = AuthService;
