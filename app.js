const express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.set('views', './views'); // EJS 사용

app.use(express.static('docs'))

app.get('/',(req,res)=>{
    res.render('index');
})

io.on('connection', (socket)=>{
    console.log('hello')
});

http.listen(80, () => {
    console.log("server open");
})