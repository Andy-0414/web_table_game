var one = (ele) => document.querySelector(ele);
var all = (ele) => document.querySelectorAll(ele);

var table = one('#table');
var cards = all('.card');

window.oncontextmenu = function(e){
    e.preventDefault()
}
var socket = io();
//window.location.protocol + "//" + window.location.host
socket.on('connection', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});