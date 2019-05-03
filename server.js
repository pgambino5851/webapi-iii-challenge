const express = require('express');
const configureMiddleware = require('./config/middleware');
// const uppercaseChecker = require('./config/uppercase')

const server = express();

configureMiddleware(server);

const postRoutes = require('./Posts/postRoutes')
const userRoutes = require('./Users/userRoutes')

server.use(uppercaseChecker)

function uppercaseChecker(req, res, next) {

    // let username = req.body.name;
    if(req.body.name){
        req.body.name = req.body.name.toUpperCase();
    }
    next();
}

server.use(express.json());
server.use('/posts', postRoutes);

server.use('/users', userRoutes);

server.use('/', (req, res) => {
    res.status(200).send('Hello from API project III');
})
module.exports = server;