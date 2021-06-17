const express = require("express");
const User = require("../model/User");
const Discussion = require("../model/Discussion");
const expressAsyncHandler = require("express-async-handler");
const env = require("dotenv");

const discussionRouter = express.Router();

discussionRouter.post(
  "/adddiscussion",
  expressAsyncHandler(async (req, res) => {
    try {
      const title = req.body.heading;
      const description = req.body.description;
      const userId = req.body.userId;
      const tags = req.body.tags;
      if (!(title === "" || description === "")) {
        const user = await User.findById(userId);
        if (user != null) {
          const discussion = new Discussion({
            title: title,
            description: description,
            postedBy: {
              userId: userId,
              name: user.firstName + " " + user.lastName,
            },
            postedAt: Date.now(),
            tags: tags,
            likes: [],
            dislikes: [],
            comments: [],
          });
          const savedDiscussion = await discussion.save();
          return res
            .status(200)
            .send({ message: "Success", discussion: savedDiscussion });
        } else {
          return res.status(409).send({ message: "Invalid user" });
        }
      } else {
        return res.status(409).send({ message: "Incomplete Data" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Internal server error!" });
    }
  })
);

discussionRouter.get(
  "/alldiscussions",
  expressAsyncHandler(async (req, res) => {
    try {
      const discussions = await Discussion.find({});
      return res
        .status(200)
        .send({ message: "Success", discussions: discussions });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Internal server error!" });
    }
  })
);

discussionRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const discussionId = req.params.id;
      const discussion = await Discussion.findById(discussionId);
      if (discussion != null) {
        return res
          .status(200)
          .send({ message: "Success", discussion: discussion });
      } else {
        return res
          .status(404)
          .send({ message: "Could not find the requested resource" });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(404)
        .send({ message: "Could not find the requested resource" });
    }
  })
);

discussionRouter.post(
  "/like",
  expressAsyncHandler(async (req, res) => {
    try {
      const discussionId = req.body.discussionId;
      const userId = req.body.userId;
      const discussion = await Discussion.findById(discussionId);
      if (discussion != null) {
        const user = await User.findById(userId);
        if (user != null) {
          const isLiked = discussion.likes.indexOf(userId);
          const isDisliked = discussion.dislikes.indexOf(userId);
          console.log(isLiked);
          console.log(isDisliked);
          if (isDisliked != -1) {
            discussion.dislikes.splice(isDisliked, 1);
            discussion.likes.push(userId);
            await discussion.save();
            return res
              .status(200)
              .send({ message: "Success", discussion: discussion });
          } else {
            if (isLiked == -1) {
              discussion.likes.push(userId);
              await discussion.save();
              return res
                .status(200)
                .send({ message: "Success", discussion: discussion });
            } else {
              return res
                .status(401)
                .send({ message: "Already liked this discussion." });
            }
          }
        } else {
          return res.status(409).send({ message: "Invalid user" });
        }
      } else {
        return res
          .status(404)
          .send({ message: "Given discussion doesn't exist" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Internal server error!" });
    }
  })
);

discussionRouter.post(
  "/dislike",
  expressAsyncHandler(async (req, res) => {
    try {
      const discussionId = req.body.discussionId;
      const userId = req.body.userId;
      const discussion = await Discussion.findById(discussionId);
      if (discussion != null) {
        const user = await User.findById(userId);
        if (user != null) {
          const isLiked = discussion.likes.indexOf(userId);
          const isDisliked = discussion.dislikes.indexOf(userId);
          if (isLiked != -1) {
            discussion.likes.splice(isLiked, 1);
            discussion.dislikes.push(userId);
            await discussion.save();
            return res
              .status(200)
              .send({ message: "Success", discussion: discussion });
          } else {
            if (isDisliked == -1) {
              discussion.dislikes.push(userId);
              await discussion.save();
              return res
                .status(200)
                .send({ message: "Success", discussion: discussion });
            } else {
              return res
                .status(401)
                .send({ message: "Already disliked this discussion." });
            }
          }
        } else {
          return res.status(409).send({ message: "Invalid user" });
        }
      } else {
        return res
          .status(404)
          .send({ message: "Given discussion doesn't exist" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Internal server error!" });
    }
  })
);

discussionRouter.post(
  "/comment",
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.body.userId;
      const discussionId = req.body.discussionId;
      const comment = req.body.comment;
      if (comment == "")
        return res.status(409).send({ message: "Please enter some comment" });
      const discussion = await Discussion.findById(discussionId);
      if (discussion != null) {
        const user = await User.findById(userId);
        if (user != null) {
          discussion.comments.push({
            userId: userId,
            name: user.firstName + " " + user.lastName,
            postedAt: Date.now(),
            comment: comment,
          });
          await discussion.save();
          return res
            .status(200)
            .send({ message: "Success", discussion: discussion });
        } else {
          return res.status(409).send({ message: "Invalid user" });
        }
      } else {
        return res
          .status(404)
          .send({ message: "Given discussion doesn't exist" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Internal server error!" });
    }
  })
);

discussionRouter.post(
  "/search",
  expressAsyncHandler(async (req, res) => {
    try {
      const search = req.body.search;
      let searchPattern = new RegExp(search, "i");
      const discussion = await Discussion.find({ title: searchPattern });
      return res.status(200).send(discussion);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Internal server error!" });
    }
  })
);

module.exports = discussionRouter;
