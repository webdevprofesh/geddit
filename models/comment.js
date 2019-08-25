const mongoUtils = require('../utils/mongo');
const getUserId = require('../auth/getUserId');

const Comment = {
    id: "UID",
    date: "date",
    body: "String",
    postId: "PostIdRef",
    commentId: "CommentIdRef", // optional
    userId: "UserIdRef",
    comments: ["CommentIdRef"]
}

async function createComment(req, res) {
    const {body, postId, commentId} = req.body;
    const userId = getUserId(req.get('authorization'));

    const errors = [];

    if (!body) {
        errors.push({msg: 'post body required'});
    }

    if (errors.length) {
        return res.json({errors});
    }

    const result = await mongoUtils.create({
        userId,
        collection: 'comment',
        data: {
            body,
            date: new Date(),
            postId,
            commentId,
            comments: []
        }
    });

    await mongoUtils.add({collection: 'user', id: userId, key: 'comments', data: result.insertedId});

    if (commentId) { // Comment comment
        await mongoUtils.add({collection: 'comment', id: commentId, key: 'comments', data: result.insertedId});
    } else { // Post comment
        await mongoUtils.add({collection: 'post', id: postId, key: 'comments', data: result.insertedId});
    }

    res.json({commentId: result.insertedId});
}

async function readComment(req, res) {
    const {commentId} = req.params;
    const result = await mongoUtils.read({collection: 'comment', id: commentId});
    res.json(result);
}

async function updateComment(req, res) {
    const {commentId} = req.params;
    const userId = getUserId(req.get('authorization'));

    const data = {};
    if (req.body.body) {
        data.body = req.body.body;
    }

    if (!Object.keys(data).length) {
        return res.json({errors: [{msg: 'No valid fields to update'}]});
    }

    data.edited = true;

    await mongoUtils.update({collection: 'comment', id: commentId, userId, data});
    res.json(data);
}

async function deleteComment(req, res) {
    const {commentId} = req.params;
    const userId = getUserId(req.get('authorization'));

    await mongoUtils.delete({collection: 'comment', id: commentId, userId});

    res.json({commentId});
}

module.exports = {
    createComment, readComment, updateComment, deleteComment
}