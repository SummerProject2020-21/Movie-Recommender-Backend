// DECLARING MODULES
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const env = require("dotenv");
const http = require("http");
const bodyParser = require("body-parser");

const userRoute = require('./router/UserRouter');
const discussionRoute = require('./router/DiscussionRouter');

//DEFINING MODULES
const app = express();
const port = 3001 || process.env.PORT;
const hostname = "localhost";

//VALIDATING MODULES POLICY
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
env.config();

//CONNECTING MONGO DB
const url = process.env.MONGODB;
mongoose.connect(`${url}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

//SENDING TO ROUTES
app.use("/api/user",userRoute);
app.use("/api/discussion",discussionRoute);

//STARTING APP
app.listen(process.env.PORT || 3001, () => {
    console.log(`Server Running at http://${hostname}:${port}/`);
  });