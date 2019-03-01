var roomList = document.getElementById('rommListTable')
var table = new TableTop(document.getElementById('table'));
table.clearTableToClient()

function joinRoom(roomName,userCount){
    if(userCount < 6)
    {
        socket.emit('joinRoom', {
            roomName: roomName
        })
        roomList.parentElement.style.display = "none"
        table.init()
    }
}

socket.on('roomList',data=>{
    roomList.innerHTML = ''
    data.forEach(x=>{
        roomList.innerHTML +=`
            <li onclick="joinRoom('${x.roomName}',${x.userCount})">
                <h2>${x.roomName}</h2><p>${x.userCount}/6</p>
            </li>
        `
    })
})

window.oncontextmenu = function (e) {
    e.preventDefault()
}