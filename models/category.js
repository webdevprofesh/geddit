const mongoUtils = require('../utils/mongo');

const Category = {
    id: 'UID',
    title: 'String',
    body: 'String',
    image: 'String',
    posts: ['postIdRef']
}

async function createCategory(req, res) {
    const {title, body, image} = req.body;

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
        data: {
            title,
            body,
            image,
            date: new Date(),
            posts: []
        }
    });

    res.json({categoryId: result.insertedId});
}

async function readCategory(req, res) {
    const {categoryId} = req.params;
    const result = await mongoUtils.read({collection: 'category', id: categoryId});

    res.json(result);
}

async function updateCategory(req, res) {
    const {categoryId} = req.params;

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

    await mongoUtils.update({collection: 'category', id: categoryId, data});
    res.json(data);
}

module.exports = {
    createCategory, readCategory, updateCategory
}