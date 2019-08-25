const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000

const category = require('./models/category');
const comment = require('./models/comment');
const post = require('./models/post');
const user = require('./models/user');

const {createCategory, readCategory, updateCategory} = category;
const {createComment, readComment, updateComment, deleteComment} = comment;
const {createPost, readPost, updatePost, deletePost} = post;
const {createUser, readUser, updateUser, deleteUser} = user;

app.use(bodyParser.json());

app.post('/category', (req, res) => createCategory(req, res));
app.get('/category/:categoryId', (req, res) => readCategory(req, res));
app.put('/category/:categoryId', (req, res) => updateCategory(req, res));

app.post('/comment', (req, res) => createComment(req, res));
app.get('/comment/:commentId', (req, res) => readComment(req, res));
app.put('/comment/:commentId', (req, res) => updateComment(req, res));
app.delete('/comment/:commentId', (req, res) => deleteComment(req, res));

app.post('/post', (req, res) => createPost(req, res));
app.get('/post/:postId', (req, res) => readPost(req, res));
app.put('/post/:postId', (req, res) => updatePost(req, res));
app.delete('/post/:postId', (req, res) => deletePost(req, res));

app.post('/user', (req, res) => createUser(req, res));
app.get('/user/:userId', (req, res) => readUser(req, res));
app.put('/user/:userId', (req, res) => updateUser(req, res));
app.delete('/user/:userId', (req, res) => deleteUser(req, res));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
