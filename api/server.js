const express = require('express');
const server = express();
require('dotenv').config();
const authRouter = require('./Auth/auth-router');
const userRouter = require('./users/users-router');
const tweetRouter = require('./tweets/tweets-router');
const replyRouter = require('./replies/replies-router');
const likeRouter = require('./likes/likes-router');
const bookmarkRouter = require('./bookmarks/bookmarks-router');
const { restricted, checkRole } = require('./Auth/auth-middleware');


server.use(express.json());

server.get('/', (req,res) => {
    res.send({message: "App is running..."})
})

server.use('/api/auth', authRouter);
server.use('/api/users', restricted, checkRole("Author"), userRouter);
server.use('/api/tweets', restricted, checkRole("Author"), tweetRouter);
server.use('/api/replies', restricted, replyRouter);
server.use('/api/likes', restricted, likeRouter);
server.use('/api/bookmarks', restricted, bookmarkRouter);


server.use((err,req,res,next) => {
    res
        .status(err.status || 500)
        .json({message: err.message || "Server error..."})
})

module.exports = server;