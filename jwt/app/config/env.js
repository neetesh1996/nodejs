const env = {
  database: "restdb",
  username: "root",
  password: "",
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  SENDGRID_API_KEY:
    "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"
};
module.exports = env;
