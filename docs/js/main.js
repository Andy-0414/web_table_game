
// var roomList = document.getElementById('rommListTable')

var table = new TableTop(document.getElementById('table'));
table.init()

window.oncontextmenu = function (e) {
    e.preventDefault()
}