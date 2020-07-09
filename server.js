// Express Server Setup
import express from 'express';
var app = express();

// Routes
app.get('/', function (req, res) {
    res.send('<html><body><h1>Hello World</h1></body></html>');
});

var server = app.listen(8080, function () {
    console.log('Node server is running..');
});