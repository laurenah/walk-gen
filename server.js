// Express Server Setup
import express from 'express';
var app = express();

// define routes here..

var server = app.listen(5000, function () {
    console.log('Node server is running..');
});