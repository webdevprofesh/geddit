const mongoUtils = require('../utils/mongo');
const getUserId = require('../auth/getUserId');

const Post = {
    id: 'UID',
    userId: 'UserIdRef',
    date: 'date',
    title: 'String',
    body: 'String',
    categoryId: 'CategoryIdRef',
    image: 'String?',
    edited: false,
    comments: ["CommentIdRef"],
}

async function createPost(req, res) {
    const {title, categoryId, body, image} = req.body;
    const userId = getUserId(req.get('authorization'));
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
        userId,
        collection: 'post',
        data: {
            title,
            body,
            categoryId,
            image,
            edited: false,
            date: new Date(),
            comments: []
        }
    });

    const refPromises = [
        mongoUtils.add({collection: 'user', id: userId, key: 'posts', data: result.insertedId}),
        mongoUtils.add({collection: 'category', id: categoryId, userId, key: 'posts', data: result.insertedId})
    ];

    await Promise.all(refPromises);

    res.json({postId: result.insertedId});
}

async function readPost(req, res) {
    const {postId} = req.params;
    const result = await mongoUtils.read({collection: 'post', id: postId});
    res.json(result);
}

async function updatePost(req, res) {
    const {postId} = req.params;
    const userId = getUserId(req.get('authorization'));
    const validFields = ['title', 'body', 'image'];
    const data = {};

    validFields.forEach(field => {
        if (req.body[field]) {
            data[field] = req.body[field];
        }
    });

    if (!Object.keys(data).length) {
        return res.json({errors: [{msg: 'No valid fields to update'}]});
    }

    data.edited = true;

    await mongoUtils.update({collection: 'post', id: postId, userId, data});
    res.json(data);
}

async function deletePost(req, res) {
    const {postId} = req.params;
    const userId = getUserId(req.get('authorization'));

    await mongoUtils.delete({collection: 'post', id: postId, userId});

    res.json({postId});
}

module.exports = {
    createPost, readPost, updatePost, deletePost
}