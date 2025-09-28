const testingRouter = require("express").Router();
const Blog = require("../models/blog.schemas");
const User = require("../models/user.schemas");

testingRouter.post("/reset", async (request, response) => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  response.status(204).end();
});

module.exports = testingRouter;
