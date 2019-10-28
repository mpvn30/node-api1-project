// implement your API here
const express = require('express');

const db = require('./data/db.js');

const server = express();

server.use(express.json());


server.get('/', (req, res) => {
    res.send('Hello')
})

//POST
server.post('/api/users', (req, res) => {
    console.log(req.body);
    const { name, bio } = req.body;
    if (!name || !bio) {
      res.status(400).json({errorMessage: "Please provide name and bio for the user."});
    } else {
      db.insert({ name, bio })
        .then(({ id }) => {
          db.findById(id)
            .then(user => {
              res.status(201).json(user);
            })
            .catch(error => {
              console.log(error);
              res.status(500).json({error: "The users information could not be retrieved."});
            });
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({error: "There was an error while saving the user to the database"});
        });
    }
  });

//GET
server.get('/api/users', (req, res) => {
    db.find()
    .then(user => {
        res.json(user)
    })
    .catch(error => 
        res.status(500).send({ error: "The users information could not be retrieved." }))
})

//GETBYID
server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
    .then(user => {
        if(user){
            res.status(200).json(user);
        }else{
            res.status(404).json({message: "The user with the specified ID does not exist."})
        }
    })
    .catch(error => {
        res.status(500).json({error: "The user information could not be retrieved."})
    })
})

//DELETE
server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id)
    .then(user => {
        if(user){
            console.log(user);
        }else{
            res.status(404).json({message: "The user with the specified ID does not exist."})
        }
    })
    .catch(error => {
        res.status(500).json({error: "The user could not be removed"})
    })
})

//PUT
server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const { name, bio } = req.body;
    if (!name && !bio) {
      return res.status(400).json({error: 'Please provide name and bio for the user.'});
    }
    db.update(id, { name, bio })
      .then(updated => {
        if (updated) {
          db.findById(id)
            .then(user => res.status(200).json(user))
            .catch(err => {
              console.log(err);
              res.status(500).json({error:"The user information could not be modified"});
            });
        } else {
          res.status(404).json({error: `The user with the specified ID does not exist.`});
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({error: 'The user information could not be modified.'});
      });
  });


const port = 9000;
server.listen(port, () => console.log('Server is listening on port 9000'))