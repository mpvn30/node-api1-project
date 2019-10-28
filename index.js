// implement your API here
const express = require('express');

const db = require('./data/db.js');

const server = express();

server.use(express.json());


server.get('/', (req, res) => {
    res.send('Hello')
})

//GET
server.get('/api/users', (req, res) => {
    db.find()
    .then(users => {
        if (users) {
        res.status(200).json(users)
    } else {
        res.status(404).json({error: "Please provide name and bio for the user."});
    }
    })
    .catch(error => 
        res.status(500).send(error))
})

const port = 9000;
server.listen(port, () => console.log('Server is listening on port 9000'))