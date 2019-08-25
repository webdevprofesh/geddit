require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const category = require('./models/category');
const comment = require('./models/comment');
const post = require('./models/post');
const user = require('./models/user');

require('./auth/passport');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const authMiddleware = passport.authenticate('jwt', {session: false});

const {createCategory, readCategory, updateCategory, deleteCategory} = category;
const {createComment, readComment, updateComment, deleteComment} = comment;
const {createPost, readPost, updatePost, deletePost} = post;
const {createUser, readUser, updateUser, deleteUser} = user;

const app = express();
const port = 3000

app.use(bodyParser.json());

// Auth routes
app.post('/login', function (req, res, next) {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }
       req.login(user, {session: false}, (err) => {
           if (err) {
               res.send(err);
           }
           // generate a signed json web token with the contents of user object and return it in the response
           const userId = `${user._id}`;
           const token = jwt.sign(userId, process.env.SECRET);
           return res.json({
               user: {
                    _id: user._id,
                    username: user.username,
                    lastLogin: user.lastLogin,
                    image: user.image,
                    posts: user.posts,
                    comments: user.comments,
                    preferences: user.preferences
                },
                token});
        });
    })(req, res);
});

app.post('/category', authMiddleware, (req, res) => createCategory(req, res));
app.get('/category/:categoryId', (req, res) => readCategory(req, res));
app.put('/category/:categoryId', authMiddleware, (req, res) => updateCategory(req, res));
app.delete('/category/:categoryId', authMiddleware, (req, res) => deleteCategory(req, res));

app.post('/comment', (req, res) => createComment(req, res));
app.get('/comment/:commentId', (req, res) => readComment(req, res));
app.put('/comment/:commentId', (req, res) => updateComment(req, res));
app.delete('/comment/:commentId', (req, res) => deleteComment(req, res));

app.post('/post', authMiddleware, (req, res) => createPost(req, res));
app.get('/post/:postId', (req, res) => readPost(req, res));
app.put('/post/:postId', authMiddleware, (req, res) => updatePost(req, res));
app.delete('/post/:postId', authMiddleware, (req, res) => deletePost(req, res));

app.post('/user', (req, res) => createUser(req, res));
app.get('/user/:userId', (req, res) => readUser(req, res));
app.put('/user', authMiddleware, (req, res) => updateUser(req, res));
app.delete('/user', authMiddleware, (req, res) => deleteUser(req, res));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
