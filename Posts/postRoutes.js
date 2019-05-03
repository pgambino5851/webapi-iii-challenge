const express = require('express');
const db = require('../data/helpers/postDb')
const router = express.Router();

router.use(express.json());

const sendUserError = (status, message, res) => {
    // This is just a helper method that we'll use for sending errors when things go wrong.
    res.status(status).json({ errorMessage: message });
    return;
  };


router.get('/', (req, res) => {
    db.get()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        res.status(500).json({error: "The posts information could not be retrieved"})
    })
})

router.get('/:id', (req, res) => {
    const postId = req.params.id;
    db.getById(postId)
    .then(post => {
        if(post.length === 0) {
            res.status(404).json({message: "The post with the specified ID does not exist."})
            return;
        }
        res.status(200).json(post)
    })
    .catch(err => {
        res.status(500).json({error: "The post information could not be retrieved."})
    })
})



router.put('/:id', (req, res) => {
    const postId = req.params.id;
    const {text} = req.body;
    const postInfo = req.body;
    if(!text) {
        sendUserError(400, "Please provide text for the post to be updated with.", res);
        return;
    }
    db.update(postId, {text})
    .then(post => {
        if(!post) {
            sendUserError(404, "User with specified ID does not exist", res);
            return;
        }
    })
    .catch(err => {
        sendUserError(500, "post information could not be modifed", err)
    })
    db.getById(postId)
    .then(post => {
        if(!post) {
            sendUserError(404, 'Post with specified ID not found', res);
            return;
        }
        res.status(200).json(post)
    })
})

router.delete('/:id', (req, res) => {
    const postId = req.params.id;
    db.remove(postId)
    .then(post => {
        if(post.length === 0) {
            res.status(404).json({message: "The post with the specified ID does not exist." })
            return;
        }
        res.status(200).json({message: `User ${postId} has successfully been deleted`})
    })
    .catch(err => {
        console.log("error:", err);
        res.status(500).json({error: "The post could not be removed"})
    })
})

router.post('/', (req, res) => {
    const postInfo = req.body;
    if(postInfo.text){
        db.insert(postInfo)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            res.status(500).json({error: err, errorMessage: "There was an error saving the post to the database"})
        })
    }  else {
        res.status(400).json({errorMessage: "Please provide text for your post"})
    }
})



module.exports = router