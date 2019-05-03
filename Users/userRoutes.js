const express = require('express');
const db = require('../data/helpers/userDb')
const router = express.Router();
const sendUserError = (status, message, res) => {
    // This is just a helper method that we'll use for sending errors when things go wrong.
    res.status(status).json({ errorMessage: message });
    return;
  };

  router.get('/', (req, res) => {
    db.get()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({error: "The users information could not be retrieved"})
    })
})

router.get('/:id', (req, res) => {
    const userId = req.params.id;
    db.getById(userId)
    .then(user => {
        if(!user) {
            res.status(404).json({message: "The user with the specified ID does not exist."})
            return;
        }
        res.status(200).json(user)
    })
    .catch(err => {
        res.status(500).json({error: "The user information could not be retrieved."})
    })
})

router.post('/', (req, res) => {
    // one way to get data from the client is i the request's body
    // axios.post(url, data) => the data shows up as the body on the server
    const userInfo = req.body;
    console.log('request body: ', userInfo);
    if(userInfo.name){
        db.insert(userInfo).then(user => {
            res.status(201).json(user)
        }).catch(err => {
            //handle error
            console.log(err);
            res.status(500).json({error: err,  errorMessage: "There was an error while saving the user to the database" })
        })
    } else {
        res.status(400).json({errorMessage: "Please provide name and bio for the user"})
    }
})

router.put('/:id', (req, res) => {
    const userId = req.params.id;
    const {name} = req.body;
    const userInfo = req.body;
    if(!name) {
        sendUserError(400, "Please provide a name for the user to be updated with.", res);
        return;
    }
    db.update(userId, {name})
    .then(user => {
        if(!user) {
            sendUserError(404, "User with specified ID does not exist", res);
            return;
        }
    })
    .catch(err => {
        sendUserError(500, "User information could not be modifed", err)
    })
    db.getById(userId)
    .then(user => {
        if(!user) {
            sendUserError(404, 'User with specified ID not found', res);
            return;
        }
        res.status(200).json(user)
    })
})

router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    db.remove(userId)
    .then(user => {
        if(!user) {
            res.status(404).json({message: "The user with the specified ID does not exist." })
            return;
        }
        res.status(200).json({message: `User ${userId} has successfully been deleted`})
    })
    .catch(err => {
        console.log("error:", err);
        res.status(500).json({error: "The post could not be removed"})
    })
})




  module.exports = router