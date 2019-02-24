var one = (ele) => document.querySelector(ele);
var all = (ele) => document.querySelectorAll(ele);

var table = one('#table');
var cards = all('.card');

window.oncontextmenu = function(e){
    e.preventDefault()
}