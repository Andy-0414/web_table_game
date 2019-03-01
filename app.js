const express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var TableManager = require('./table/findTableModule')

app.use(express.static('docs'))

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})

function chkToMulti(x){
    return x.count || (x.option ? x.option.stack : false)
}

var TableList = [
    {
        roomName : "Hello",
        userList : new Set(),
        tableState : []
    },
    {
        roomName: "World!",
        userList: new Set(),
        tableState: []
    },
]

var tableState = []
io.on('connection', (socket)=>{
    var findRoomIndex = (data)=> TableList.findIndex(x=> x.roomName == data)
    var getThisRoomName = (sk) => Object.keys(sk.rooms)[0]
    var getThisRoomIndex = () => findRoomIndex(getThisRoomName(socket))
    var sendRoomList = ()=>{
        io.sockets.emit('roomList', TableList.map(x => {
            return {
                roomName: x.roomName,
                userCount: x.userList.size
            }
        }))
    }
    sendRoomList()
    socket.on('joinRoom',data=>{
        var currentRoomIndex = getThisRoomIndex()
        var nextRoomIndex = findRoomIndex(data.roomName)
        if (TableList[nextRoomIndex].userList.size < 6){
            if (currentRoomIndex != -1) {
                TableList[currentRoomIndex].userList.delete(socket.id)
            }
            socket.leaveAll()
            TableList[nextRoomIndex].userList.add(socket.id)
            socket.join(data.roomName)
            sendRoomList()
            TableList[nextRoomIndex].tableState.forEach((x, idx) => {
                TableList[nextRoomIndex].tableState[idx]._id = idx
                if (chkToMulti(x)) {
                    socket.emit('createProps', x)
                }
                else {
                    socket.emit('createProp', x)
                }
            })
        }
    })


    var changeTableState = (data) => {
        TableList[getThisRoomIndex()].tableState[TableList[getThisRoomIndex()].tableState.findIndex(x => x._id == data._id)] = data
    }
    socket.on('clearTable',data=>{
        TableList[getThisRoomIndex()].tableState = []
        socket.broadcast.to(getThisRoomName(socket)).emit('clearTable', true)
    })
    socket.on('decreaseZindexAll',data=>{
        socket.broadcast.to(getThisRoomName(socket)).emit('decreaseZindexAll',data)
    })
    socket.on('createProp',data=>{
        TableList[getThisRoomIndex()].tableState.push(data)
        socket.broadcast.to(getThisRoomName(socket)).emit('createProp',data)
    })
    socket.on('reverse', data => {
        tableState[tableState.findIndex(x => x._id == data._id)].option.reverse = data.reverse
        socket.broadcast.to(getThisRoomName(socket)).emit('reverse', data)
    })
    socket.on('changeProp',data=>{
        changeTableState(data)
        socket.broadcast.to(getThisRoomName(socket)).emit('changeProp', data)
    })
    socket.on('removeProp',data=>{
        TableList[getThisRoomIndex()].tableState.splice(TableList[getThisRoomIndex()].tableState.findIndex(x => x._id == data._id), 1)
        socket.broadcast.to(getThisRoomName(socket)).emit('removeProp', data)
    })
    socket.on('createPropToServer',data=>{
        TableManager.getRequestProp(data.primalName)
        .then(propOriginal=>{
            propOriginal._id = data._id
            propOriginal.x = data.x || propOriginal.x
            propOriginal.y = data.y || propOriginal.y
            TableList[getThisRoomIndex()].tableState.push(propOriginal)
            if (chkToMulti(propOriginal)) {
                io.sockets.to(getThisRoomName(socket)).emit('createProps', propOriginal)
            }
            else {
                io.sockets.to(getThisRoomName(socket)).emit('createProp', propOriginal)
            }
        })
        .catch(err =>{
            console.log("NO DATA")
        })
    })
    socket.on('disconnect', data => {
        TableList.forEach(x=>{
            x.userList.delete(socket.id)
        })
    })

});


http.listen(3000, () => {
    console.log("server open");
})