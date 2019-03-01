const express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var TableManager = require('./table/findTableModule')

app.use(express.static('docs'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

function chkToMulti(x) {
    return x.count || (x.option ? x.option.stack : false)
}

var TableList = [
    {
        roomName: "Hello",
        userList: new Set(),
        currentId: 0,
        tableState: []
    },
    {
        roomName: "World!",
        userList: new Set(),
        currentId: 0,
        tableState: []
    },
]

io.on('connection', (socket) => {
    var findRoomIndex = (data) => TableList.findIndex(x => x.roomName == data)
    var getThisRoomName = (sk) => Object.keys(sk.rooms)[0]
    var getThisRoomIndex = () => findRoomIndex(getThisRoomName(socket))

    var sendRoomList = () => {
        io.sockets.emit('roomList', TableList.map(x => {
            return {
                roomName: x.roomName,
                userCount: x.userList.size
            }
        }))
    }
    sendRoomList()
    socket.on('joinRoom', data => {
        var currentRoomIndex = getThisRoomIndex()
        var nextRoomIndex = findRoomIndex(data.roomName)
        if (TableList[nextRoomIndex].userList.size < 6) {
            if (currentRoomIndex != -1) {
                TableList[currentRoomIndex].userList.delete(socket.id)
            }
            socket.leaveAll()
            TableList[nextRoomIndex].userList.add(socket.id)
            socket.join(data.roomName)
            sendRoomList()
            TableManager.getPropList()
            .then(data=>{
                socket.emit('serverProps',data)
            })
            .catch(data=>{
                console.log(data)
            })
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
        var currentRoomIndex = getThisRoomIndex()
        if (currentRoomIndex != -1) {
            TableList[currentRoomIndex].tableState[TableList[currentRoomIndex].tableState.findIndex(x => x._id == data._id)] = data
        }
    }
    socket.on('clearTable', data => {
        var currentRoomIndex = getThisRoomIndex()
        if (currentRoomIndex != -1) {
            TableList[currentRoomIndex].tableState = []
            io.sockets.to(getThisRoomName(socket)).emit('clearTable', true)
        }
    })
    socket.on('decreaseZindexAll', data => {
        io.sockets.to(getThisRoomName(socket)).emit('decreaseZindexAll', data)
    })
    socket.on('createProp', data => {
        var currentRoomIndex = getThisRoomIndex()
        if (currentRoomIndex != -1) {
            data._id = TableList[currentRoomIndex].currentId++
            TableList[currentRoomIndex].tableState.push(data)
            io.sockets.to(getThisRoomName(socket)).emit('createProp', data)
            if (data.isAttach) {
                socket.emit('attachProp',data._id)
            }
        }
    })
    socket.on('createProps', data => {
        var currentRoomIndex = getThisRoomIndex()
        if (currentRoomIndex != -1) {
            data._id = TableList[currentRoomIndex].currentId++
            TableList[currentRoomIndex].tableState.push(data)
            io.sockets.to(getThisRoomName(socket)).emit('createProps', data)
        }
    })
    socket.on('reverse', data => {
        var currentRoomIndex = getThisRoomIndex()
        if (currentRoomIndex != -1) {
            TableList[currentRoomIndex].tableState[TableList[currentRoomIndex].tableState.findIndex(x => x._id == data._id)].option.reverse = data.reverse
            io.sockets.to(getThisRoomName(socket)).emit('reverse', data)
        }
    })
    socket.on('changeProp', data => {
        changeTableState(data)
        io.sockets.to(getThisRoomName(socket)).emit('changeProp', data)
    })
    socket.on('removeProp', data => {
        var currentRoomIndex = getThisRoomIndex()
        if (currentRoomIndex != -1) {
            TableList[currentRoomIndex].tableState.splice(TableList[currentRoomIndex].tableState.findIndex(x => x._id == data._id), 1)
            io.sockets.to(getThisRoomName(socket)).emit('removeProp', data)
        }
    })
    socket.on('disconnect', data => {
        TableList.forEach(x => {
            x.userList.delete(socket.id)
        })
    })
});


http.listen(3000, () => {
    console.log("server open");
})