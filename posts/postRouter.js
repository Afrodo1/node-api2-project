const express = require('express');
const Posts = require('../data/db');

const router = express.Router();

//Retrieves all posts

router.get('/', (req, res)=>{
    Posts.find(req.query)
        .then(posts =>{
            res.status(200).json(posts);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Error retrieving the Posts",
            });
        });
});

//Retrieves Posts by Id number

router.get("/:id", (req, res) => {
    const id = req.params.id;
    if (!id) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    } else {
      Posts.findById(id)
        .then(post => {
          res.status(200).json(post);
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: "The post information could not be retrieved." });
        });
    }
  });
  
  //Retrieves Comments by Id number

  router.get("/:id/comments", (req, res) => {
    const id = req.params.id;
    if (!id) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    } else {
      Posts.findCommentById(id)
        .then(com => {
          res.status(200).json(com);
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: "The comments information could not be retrieved." });
        });
    }
  });

  //Creates a new Post with title and contents

  router.post("/", (req, res) => {
    const body = req.body;
    if (!body.contents || !body.title) {
      res.status(400).json({
        errorMessage: "Please provide title and contents for the post."
      });
    } else {
      Posts.insert(body)
        .then(id => {
          res.status(201).json(id);
        })
        .catch(err => {
          res.status(500).json({
            error: "There was an error while saving the post to the database"
          });
        });
    }
  });
  
  //Adds a new comment to a specified post_id

  router.post("/:id/comments", (req, res) => {
    const body = req.body;
    const id = req.params.id;
    console.log(id);
    if (!id) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    } else if (!body.text) {
      res
        .status(400)
        .json({ errorMessage: "Please provide text for the comment." });
    } else {
      Posts.insertComment(body)
        .then(re => {
          res.status(201).json(re);
        })
        .catch(err => {
          res.status(500).json({
            error: "There was an error while saving the comment to the database"
          });
        });
    }
  });
  
  router.delete("/:id", (req, res) => {
    const id = req.params.id;
    if (!id) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    } else {
      Posts.remove(id)
        .then(re => {
          res.status(201).json(re);
        })
        .catch(err => {
          res.status(500).json({ error: "The post could not be removed" });
        });
    }
  });


  //Changes the title and contents according to Id number
  router.put("/:id", (req, res) => {
    const id = req.params.id;
    const body = req.body;
    if (!id) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    } else if (!body.title || !body.contents) {
      res
        .status(400)
        .json({
          errorMessage: "Please provide title and contents for the post."
        });
    } else {
      Posts.update(id, body)
        .then(re => {
          res.status(200).json(re);
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: "The post information could not be modified." });
        });
    }
  });

module.exports = router;