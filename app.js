const express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('docs'))

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})

io.on('connection', (socket)=>{
    console.log('hello')
});

http.listen(3000, () => {
    console.log("server open");
})