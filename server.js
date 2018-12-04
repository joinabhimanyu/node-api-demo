"use strict";
const config = require('./common/config.json');
const path = require('path');
const messages = require('./common/messages');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static(path.join(__dirname, '/public/graph')));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, Authorization, Content-Length, X-Requested-With, A' +
        'ccess-Control-Allow-Origin,x-access-token');
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
};
app.use(allowCrossDomain);

app.get('/', (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, 'public','graph', 'index.html'));
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

config['api-routes'].forEach(element => {
    const apiRoot = config['api-root'];
    app.use(require(apiRoot.concat('/',element)));
});

const server = app.listen(process.env.PORT || config.port, () => {
    console.log(messages.messServerRunningAtPort);
});