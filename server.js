//https://peaceful-refuge-56731.herokuapp.com/
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

var globalVals = [{beat: 0, speed: 300, tonic: 0, octave: 4, scale: 'major'}];

var allNotes = [65.41, 61.74, 58.27, 55, 51.91, 49, 46.25, 43.65, 41.2, 38.89, 36.71, 34.65, 32.7];
var majorNotes = [0,1,3,5,7,8,10,12];
var minorNotes = [0,2,4,5,7,9,10,12];
var chosenNotes = [];
var majorMinor = 'major';

for(i=0; i<240; i++){
    var thisNote;
        if(i < 16){
            thisNote = allNotes[majorNotes[0]]*2;
        } else if(i < 32){
            thisNote = allNotes[majorNotes[1]]*2;
        } else if(i < 48){
            thisNote = allNotes[majorNotes[2]]*2;
        } else if(i < 64){
            thisNote = allNotes[majorNotes[3]]*2;
        } else if(i < 80){
            thisNote = allNotes[majorNotes[4]]*2;
        } else if(i < 96){
            thisNote = allNotes[majorNotes[5]]*2;
        } else if(i < 112){
            thisNote = allNotes[majorNotes[6]]*2;
        } else if(i < 128){
            thisNote = allNotes[majorNotes[7]]*2;
        } else if(i < 144){
            thisNote = allNotes[majorNotes[1]];
        } else if(i < 160){
            thisNote = allNotes[majorNotes[2]];
        } else if(i < 176){
            thisNote = allNotes[majorNotes[3]];
        } else if(i < 192){
            thisNote = allNotes[majorNotes[4]];
        } else if(i < 208){
            thisNote = allNotes[majorNotes[5]];
        } else if(i < 224){
            thisNote = allNotes[majorNotes[6]];
        } else if(i < 240){
            thisNote = allNotes[majorNotes[7]];
        } else{
            thisNote = 0;
        }

    chosenNotes.push(thisNote);

    var squareVal =  {index: i, inst1OnOff: 'off', inst2OnOff: 'off', inst3OnOff: 'off', inst4OnOff: 'off', numInsts: 0, note: thisNote};
    squareVals.push(squareVal);
}

for(i=0; i < 4; i++){
    var instrumentVal = {instIndex: i, waveType: 'sine', attack: 50, decay: 50, sustain: 50, release: 50, modFreq: 50, modAmp: 50};
    instrumentVals.push(instrumentVal);
}

var beatTimer = globalVals[0].speed;
var beatIndex = 0;

function loop() {
    setTimeout(loop, beatTimer);
    globalVals[0].beat = beatIndex;
    io.emit('newBeat', beatIndex);
    if(beatIndex < 15){
        beatIndex++;
    } else{
        beatIndex = 0;
    }

    if(majorMinor != globalVals[0].scale){
        //console.log('not equal');
        majorMinor = globalVals[0].scale;
        //console.log(majorMinor);
        changeScale();
    }
    
}
    
loop();

app.get('/squares', (req, res) =>{
    res.send(squareVals)
})

app.get('/instruments', (req, res) =>{
    res.send(instrumentVals)
})

app.get('/globals', (req, res) =>{
    res.send(globalVals);
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

app.post('/globals', (req, res) =>{
    globalVals[0] = (req.body);
    beatTimer = globalVals[0].speed;
    io.emit('global', req.body);
    res.sendStatus(200);
})

io.on('connection', (socket) => {
    console.log('a user connected');
})

var server = http.listen(port,() => {
    console.log('server is listening on port', server.address().port)
})

function nextBeat(){
    io.emit('newBeat');
}

function changeScale(){
    var thisNote;
    if(majorMinor == 'major'){
        console.log('majr notes');
        for(i = 0; i < 240; i++){
            if(i < 16){
                thisNote = allNotes[majorNotes[0]]*2;
            } else if(i < 32){
                thisNote = allNotes[majorNotes[1]]*2;
            } else if(i < 48){
                thisNote = allNotes[majorNotes[2]]*2;
            } else if(i < 64){
                thisNote = allNotes[majorNotes[3]]*2;
            } else if(i < 80){
                thisNote = allNotes[majorNotes[4]]*2;
            } else if(i < 96){
                thisNote = allNotes[majorNotes[5]]*2;
            } else if(i < 112){
                thisNote = allNotes[majorNotes[6]]*2;
            } else if(i < 128){
                thisNote = allNotes[majorNotes[7]]*2;
            } else if(i < 144){
                thisNote = allNotes[majorNotes[1]];
            } else if(i < 160){
                thisNote = allNotes[majorNotes[2]];
            } else if(i < 176){
                thisNote = allNotes[majorNotes[3]];
            } else if(i < 192){
                thisNote = allNotes[majorNotes[4]];
            } else if(i < 208){
                thisNote = allNotes[majorNotes[5]];
            } else if(i < 224){
                thisNote = allNotes[majorNotes[6]];
            } else if(i < 240){
                thisNote = allNotes[majorNotes[7]];
            } else{
                thisNote = 0;
            }
            chosenNotes[i] = thisNote;
        }
    } else{
        console.log('minor notes')
        for(i = 0; i < 240; i++){
            if(i < 16){
                thisNote = allNotes[minorNotes[0]]*2;
            } else if(i < 32){
                thisNote = allNotes[minorNotes[1]]*2;
            } else if(i < 48){
                thisNote = allNotes[minorNotes[2]]*2;
            } else if(i < 64){
                thisNote = allNotes[minorNotes[3]]*2;
            } else if(i < 80){
                thisNote = allNotes[minorNotes[4]]*2;
            } else if(i < 96){
                thisNote = allNotes[minorNotes[5]]*2;
            } else if(i < 112){
                thisNote = allNotes[minorNotes[6]]*2;
            } else if(i < 128){
                thisNote = allNotes[minorNotes[7]]*2;
            } else if(i < 144){
                thisNote = allNotes[minorNotes[1]];
            } else if(i < 160){
                thisNote = allNotes[minorNotes[2]];
            } else if(i < 176){
                thisNote = allNotes[minorNotes[3]];
            } else if(i < 192){
                thisNote = allNotes[minorNotes[4]];
            } else if(i < 208){
                thisNote = allNotes[minorNotes[5]];
            } else if(i < 224){
                thisNote = allNotes[minorNotes[6]];
            } else if(i < 240){
                thisNote = allNotes[minorNotes[7]];
            } else{
                thisNote = 0;
            }
            chosenNotes[i] = thisNote;
        }
        
        console.log(chosenNotes[i]);
    }
    io.emit('changeScale', chosenNotes);
}
