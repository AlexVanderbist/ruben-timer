var express = require('express');
var app = express();

let running = false;
let timerStart = Date.now();
let timerLength = 120;
let total = 0;

app.listen(3000, () => {
    console.log(`Timer app listening at http://localhost:3000`)
})

app.get('/', function (req, res) {
    let currentTs = Date.now();
    let diff = currentTs - timerStart;
    let timer = Math.floor((diff / (timerLength / 100)) % 100);

    total = Math.floor(diff/timerLength);

    return res.json({
        timer,
        total,
    });
});

app.post('/start-timer', function (req, res) {
    if (running) {
        return 'Timer already running';
    }

    running = true;
    timerStart = Date.now();

    return 'Timer started';
});

app.post('/reset-timer', function (req, res) {
    timerStart = Date.now();

    return 'Timer reset';
});

app.post('/set-timer-length/:length', function (req, res) {
    timerLength = req.params.length;

    return `Timer takes ${timerLength} seconds`;
});