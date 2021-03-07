const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
admin.initializeApp();
const app = express();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

app.get('/', async (req, res) => {
    const snapshot = await admin.firestore().collection('users').get();

    let users = [];
    snapshot.forEach((doc) => {
        let id = doc.id;
        let data = doc.data();

        users.push({id, ...data});
    });
    res.status(200).send(JSON.stringify(users));
});

app.post('/', async (req, res) => {
    const user = req.body;

    await admin.firestore().collection('users').add(user);

    res.status(201).send();
});

app.get('/model', async (req, res) => {
    const snapshot = await admin.firestore().collection('model_collection').get();
    const ver = JSON.parse(req.body).version;
    const model_ver = snapshot.doc('version');
    const version_doc = await model_ver.get();
    const version = JSON.parse(version_doc).version;
    if (ver < version) {
        const model_doc = snapshot.doc('model');
        const model = await model_doc.get();
        res.status(201).send(model);
    } else {
        res.status(201).send("{}");
    }
})


app.post('/model', async (req, res) => {
    const snapshot = await admin.firestore().collection('model_collection').get();
    const model_ver = snapshot.doc('version');

    const curr_version_doc = await model_ver.get();
    var curr_version = JSON.parse(curr_version_doc).version;
    curr_version++;

    await admin.firestore().collection('model_collection').delete();
    await admin.firestore().collection('model_collection').doc('model').set(req.body);
    await admin.firestore().collection('model_collection').doc('version').set('{ \"version\" : ' + curr_version + ' }');

    res.status(201).send();

})

exports.user = functions.https.onRequest(app);
exports.model = functions.https.onRequest(app);
