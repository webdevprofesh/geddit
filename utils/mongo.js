const mongo = require('mongodb');
const url = "mongodb://kyle:geddit123@ds019956.mlab.com:19956/geddit";
const dbName = 'geddit';

function read({id, username, collection}) {
    const _id = username ? username : new mongo.ObjectID(id);
    const key = username ? 'username' : '_id';

    return new Promise((resolve, reject) => {
        mongo.MongoClient.connect(url, function(err, db) {
            if (err) reject(err);
            const dbo = db.db(dbName);
            dbo.collection(collection).findOne({ [key]: _id }, function(err, result) {
                if (err) reject(err);
                resolve(result);
                db.close();
            });
        });
    });
}

function create({data, collection}) {
    return new Promise((resolve, reject) => {
        mongo.MongoClient.connect(url, function(err, db) {
            if (err) reject(err);
            const dbo = db.db(dbName);
            dbo.collection(collection).insertOne(data, function(err, result) {
                if (err) reject(err);
                resolve(result);
                db.close();
            });
        });
    });
}

function update({id, data, collection}) {
    return new Promise((resolve, reject) => {
        mongo.MongoClient.connect(url, function(err, db) {
            if (err) reject(err);
            const dbo = db.db(dbName);
            dbo.collection(collection).updateOne(
                { _id: new mongo.ObjectID(id) },
                {
                    $set: data
                },
                function(err, result) {
                    if (err) reject(err);
                    resolve(result);
                    db.close();
                }
            );
        });
    });
}

function deleteId({id, collection}) {
    return new Promise((resolve, reject) => {
        mongo.MongoClient.connect(url, function(err, db) {
            if (err) reject(err);
            const dbo = db.db(dbName);
            dbo.collection(collection).deleteOne({ _id: new mongo.ObjectID(id) }, function(err, result) {
                if (err) reject(err);
                resolve(result);
                db.close();
            });
        });
    })
}

module.exports = {
    read,
    create,
    update,
    delete: deleteId
};