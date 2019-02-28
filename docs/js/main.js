
var roomList = document.getElementById('rommListTable')

// `
// <li onclick="joinRoom('방이름')">
//     <h2>방이름</h2><p>0/6</p>
// </li>
// `

var table = new TableTop(document.getElementById('table'));
table.init()

window.oncontextmenu = function (e) {
    e.preventDefault()
}