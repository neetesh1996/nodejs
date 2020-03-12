
const env = require("../config/env");
const sgMail = require("@sendgrid/mail");
const db = require("../config/db.config.js");
const User = db.user;

class MailerService {
  async SendWelcomeEmail (id) {
    const user = await User.findOne(
      {
        where: {
          id: id
        }
      });
    console.log("useremail " + user.email);
    sgMail.setApiKey(env.SENDGRID_API_KEY);
    const msg = {
      to: "semip80090@eigoemail.com",
      from: user.email,
      subject: "Feedback Email",
      text: `feedback email from  ${user.name}`,
      html: `<strong>Hi Admin <br> Please review my work and give  feedback! <br> thaks & regards <br> ${user.name}</strong>`
    };
    ;
    sgMail.send(msg);
    return (`email sent from ${user.name}`);
  }
}
module.exports = MailerService;
