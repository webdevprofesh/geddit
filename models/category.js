const mongoUtils = require('../utils/mongo');
const getUserId = require('../auth/getUserId');

const Category = {
    id: 'UID',
    userId: 'UserIdRef',
    title: 'String',
    body: 'String',
    image: 'String',
    posts: ['postIdRef']
}

async function createCategory(req, res) {
    const {title, body, image} = req.body;
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
        collection: 'category',
        userId,
        data: {
            title,
            body,
            image,
            date: new Date(),
            posts: []
        }
    });

    await mongoUtils.add({collection: 'user', id: userId, key: 'categories', data: result.insertedId});

    res.json({categoryId: result.insertedId});
}

async function readCategory(req, res) {
    const {categoryId} = req.params;
    const result = await mongoUtils.read({collection: 'category', id: categoryId});

    res.json(result);
}

async function updateCategory(req, res) {
    const {categoryId} = req.params;
    const userId = getUserId(req.get('authorization'));

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

    await mongoUtils.update({collection: 'category', id: categoryId, userId, data});
    res.json(data);
}

async function deleteCategory(req, res) {
    const {category} = req.params;
    const userId = getUserId(req.get('authorization'));

    await mongoUtils.delete({collection: 'category', id: category, userId});

    res.json({category});
}

module.exports = {
    createCategory, readCategory, updateCategory, deleteCategory
}