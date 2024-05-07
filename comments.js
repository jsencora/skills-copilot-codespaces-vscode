//Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

//Use the body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Set the port
app.listen(3000, () => {
    console.log('Server running on port 3000');
});

//Read comments from file
const comments = JSON.parse(fs.readFileSync('comments.json', 'utf8'));

//Get all comments
app.get('/comments', (req, res) => {
    res.send(comments);
});

//Get a specific comment
app.get('/comments/:id', (req, res) => {
    const comment = comments.find(c => c.id === parseInt(req.params.id));
    if (!comment) res.status(404).send('The comment with the given ID was not found');
    res.send(comment);
});

//Add a comment
app.post('/comments', (req, res) => {
    const comment = {
        id: comments.length + 1,
        name: req.body.name,
        comment: req.body.comment
    };
    comments.push(comment);
    fs.writeFileSync('comments.json', JSON.stringify(comments));
    res.send(comment);
});

//Update a comment
app.put('/comments/:id', (req, res) => {
    const comment = comments.find(c => c.id === parseInt(req.params.id));
    if (!comment) res.status(404).send('The comment with the given ID was not found');

    comment.name = req.body.name;
    comment.comment = req.body.comment;
    fs.writeFileSync('comments.json', JSON.stringify(comments));
    res.send(comment);
});

//Delete a comment
app.delete('/comments/:id', (req, res) => {
    const comment = comments.find(c => c.id === parseInt(req.params.id));
    if (!comment) res.status(404).send('The comment with the given ID was not found');

    const index = comments.indexOf(comment);
    comments.splice(index, 1);
    fs.writeFileSync('comments.json', JSON.stringify(comments));
    res.send(comment);
});