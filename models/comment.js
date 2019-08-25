const mongoUtils = require('../utils/mongo');

const Comment = {
    id: "UID",
    userId: "UserIdRef",
    date: "date",
    body: "String",
    comments: ["CommentIdRef"]
}

async function createComment(req, res) {
    const {userId, body} = req.body;

    const errors = [];

    if (!body) {
        errors.push({msg: 'post body required'});
    }

    if (errors.length) {
        return res.json({errors});
    }

    const result = await mongoUtils.create({
        collection: 'comment',
        data: {
            userId,
            body,
            date: new Date(),
            comments: []
        }
    });

    res.json({commentId: result.insertedId});
}

async function readComment(req, res) {
    const {commentId} = req.params;
    const result = await mongoUtils.read({collection: 'comment', id: commentId});
    res.json(result);
}

async function updateComment(req, res) {
    const {commentId} = req.params;

    const data = {};
    if (req.body.body) {
        data.body = req.body.body;
    }

    if (!Object.keys(data).length) {
        return res.json({errors: [{msg: 'No valid fields to update'}]});
    }

    data.edited = true;

    await mongoUtils.update({collection: 'comment', id: commentId, data});
    res.json(data);
}

async function deleteComment(req, res) {
    const {commentId} = req.params;

    await mongoUtils.delete({collection: 'comment', id: commentId});

    res.json({commentId});
}

module.exports = {
    createComment, readComment, updateComment, deleteComment
}