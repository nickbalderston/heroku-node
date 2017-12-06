var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var port = process.env.PORT || 8080;

var squareVals = [

]

var instrumentVals = [

]

for(i=0; i<256; i++){
    var squareVal =  {index: i, inst1OnOff: 'off', inst2OnOff: 'off', inst3OnOff: 'off', inst4OnOff: 'off', numInsts: 0};
    squareVals.push(squareVal);
}

for(i=0; i < 4; i++){
    var instrumentVal = {instIndex: i, waveType: 'sine', attack: 0, decay: 0, sustain: 0, release: 0, modFreq: 0, modAmp: 0};
    instrumentVals.push(instrumentVal);
}

app.get('/squares', (req, res) =>{
    res.send(squareVals)
})

app.get('/instruments', (req, res) =>{
    res.send(instrumentVals)
})

app.post('/squares', (req, res) =>{
    squareVals[req.body.index]=(req.body);
    io.emit('square', req.body);
    res.sendStatus(200)
})

app.post('/instruments', (req, res) =>{
    instrumentVals[req.body.instIndex]=(req.body);
    io.emit('instrument', req.body);
    res.sendStatus(200)
})

io.on('connection', (socket) => {
    console.log('a user connected')
})

var server = http.listen(port,() => {
    console.log('server is listening on port', server.address().port)
})
