const express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var trumpTable = require('./tables/trumpTable')
var coinTable = require('./tables/coinTable')

app.use(express.static('docs'))

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})

io.on('connection', (socket)=>{
    socket.emit('createProps', trumpTable.getTrumpCard())
    socket.emit('createProps', coinTable.getCoin())
    socket.on('createProp',data=>{
        socket.broadcast.emit('createProp',data)
    })
    socket.on('reverse', data => {
        socket.broadcast.emit('reverse', data)
    })
    socket.on('changeProp',data=>{
        socket.broadcast.emit('changeProp',data)
    })
    
});

http.listen(3000, () => {
    console.log("server open");
})