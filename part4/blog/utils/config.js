require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.MONGODB_URI_TEST
    : process.env.MONGODB_URI;

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  PORT,
  MONGODB_URI,
  JWT_SECRET,
};
