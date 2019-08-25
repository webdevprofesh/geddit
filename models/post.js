const mongoUtils = require('../utils/mongo');

const Post = {
    id: 'UID',
    userId: 'UserIdRef',
    date: 'date',
    title: 'String',
    body: 'String',
    image: 'String?',
    edited: false,
    comments: ["CommentIdRef"],
}

async function createPost(req, res) {
    const {userId, title, body, image} = req.body;

    const errors = [];

    if (!title) {
        errors.push({msg: 'title required'});
    }

    if (!body) {
        errors.push({msg: 'post body required'});
    }

    if (errors.length) {
        return res.json({errors});
    }

    const result = await mongoUtils.create({
        collection: 'post',
        data: {
            userId,
            title,
            body,
            image,
            edited: false,
            date: new Date(),
            comments: []
        }
    });

    res.json({postId: result.insertedId});
}

async function readPost(req, res) {
    const {postId} = req.params;
    const result = await mongoUtils.read({collection: 'post', id: postId});
    res.json(result);
}

async function updatePost(req, res) {
    const {postId} = req.params;

    const data = {};
    const validFields = ['title', 'body', 'image'];
    validFields.forEach(field => {
        if (req.body[field]) {
            data[field] = req.body[field];
        }
    });

    if (!Object.keys(data).length) {
        return res.json({errors: [{msg: 'No valid fields to update'}]});
    }

    data.edited = true;

    await mongoUtils.update({collection: 'post', id: postId, data});
    res.json(data);
}

async function deletePost(req, res) {
    const {postId} = req.params;

    await mongoUtils.delete({collection: 'post', id: postId});

    res.json({postId});
}

module.exports = {
    createPost, readPost, updatePost, deletePost
}