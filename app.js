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
var tableState = [
    trumpTable.getTrumpCard(),
    coinTable.getCoin(),
]
io.on('connection', (socket)=>{
    var changeTableState = (data) => {
        tableState[tableState.findIndex(x => x._id == data._id)] = data
    }
    tableState.forEach((x,idx)=>{
        tableState[idx]._id = idx

        if(x.count || (x.option ? x.option.stack : false)){
            socket.emit('createProps',x)
        }
        else{
            socket.emit('createProp',x)
        }
    })
    socket.on('createProp',data=>{
        tableState.push(data)
        socket.broadcast.emit('createProp',data)
    })
    socket.on('reverse', data => {
        tableState[tableState.findIndex(x => x._id == data._id)].option.reverse = data.reverse
        socket.broadcast.emit('reverse', data)
    })
    socket.on('changeProp',data=>{
        changeTableState(data)
        socket.broadcast.emit('changeProp',data)
    })
    
});

http.listen(3010, () => {
    console.log("server open");
})