var express = require('express');
var app = express();
var fs = require('fs');
var https = require('https');

// Certificate
const privateKey = fs.readFileSync('/etc/nginx/ssl/server.alexvanderbist.com/895232/server.key', 'utf8');
const certificate = fs.readFileSync('/etc/nginx/ssl/server.alexvanderbist.com/895232/server.crt', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
};

let running = false;
let timer = 0;
let total = 0;
let timerLength = 240;

https.createServer(credentials, app).listen(3000);

setInterval(function () {
    if (! running) {
        return;
    }

    timer += 0.1;

    if (timer > timerLength) {
        timer = 0;
        total++;
    }
}, 100);

app.get('/', function (req, res) {
    return res.json({
        timer: Math.floor(timer/timerLength * 100),
        total,
    });
});

app.post('/start-timer', function (req, res) {
    if (running) {
        return res.send('Timer already running');
    }

    running = true;

    res.send('Timer started');
});

app.post('/stop-timer', function (req, res) {
    if (! running) {
        return res.send('Timer not running');
    }

    running = false;

    res.send('Timer stopped');
});

app.post('/reset-timer', function (req, res) {
    timer = 0;

    res.send('Timer reset');
});

app.post('/set-timer-length/:length', function (req, res) {
    timerLength = req.params.length;

    res.send(`Timer takes ${timerLength} seconds`);
});