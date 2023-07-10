const express = require('express');
const server = express();
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');


server.use(helmet());
server.use(cors());
server.use(morgan('dev'));
server.use(express.json());

server.get('/', (req,res) => {
    res.send({message: "App is running..."})
})

server.use((err,req,res,next) => {
    res
        .status(err.status || 500)
        .json({message: err.message || "Server error..."})
})

module.exports = server;