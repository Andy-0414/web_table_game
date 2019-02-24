var table;

(() => {
    class Card {
        constructor(option) {
            this.option = option || {
                width : 200,
                height : 300,
                transform : {
                    translateY : 0,
                    scale : 1,
                }
            }
            this.card = document.createElement('div')
            this.card.className = 'card'
            this.card.draggable = false
            this.card.controller = this

            this.card.style.width = this.option.width + "px"
            this.card.style.height = this.option.height + "px"
            
            this.x = 0
            this.y = 0

            this.zIndex = 0;

            this.centerX = this.option.width/2
            this.centerY = this.option.height/2

            this.card.style.left = this.x
            this.card.style.top = this.y

            this.detach()
        }
        attach(){
            this.card.style.boxShadow = "0px 10px 10px 1px #00000055"

            this.zIndex = 10;
            this.card.style.zIndex = this.zIndex
            this.option.transform.translateY = this.zIndex
            this.setTransform()
        }
        detach(){
            this.card.style.boxShadow = "0px 0px 5px 1px #00000055"

            this.zIndex = 0;
            this.card.style.zIndex = this.zIndex
            this.option.transform.translateY = this.zIndex
            this.setTransform()
        }
        setTransform(){
            this.card.style.transform = `
            translateY(-${this.option.transform.translateY}px) 
            scale(${this.option.transform.scale})`
        }
        setPosition() {
            this.card.style.left = (this.x - this.centerX) + "px"
            this.card.style.top = (this.y - this.centerY) + "px"
        }
        setPos(x, y) {
            this.x = x
            this.y = y
            this.setPosition()
        }

        reverse(){
            
        }

        getCard() {
            return this.card
        }
    }

    class Table {
        constructor(table) {
            this.table = table

            this.cards = []
            this.card = null

            this.cursorX;
            this.cursorY;
        }
        init() {
            function down(e) {
                if (e.target.classList.contains('card')){
                    this.card = e.target
                    this.card.controller.attach()
                } 
            }
            function up(e) {
                this.card.controller.detach()
                this.card = null;
            }
            function move(e) {
                this.cursorX = e.clientX
                this.cursorY = e.clientY
                if (this.card) {
                    this.card.controller.setPos(this.cursorX, this.cursorY)
                }
            }

            this.table.addEventListener('mousedown', down)
            this.table.addEventListener('mouseup', up)
            this.table.addEventListener('mousemove', move)
        }
        createCard() {
            this.cards.push(new Card());
        }
        render() {
            this.cards.forEach(x => {
                this.table.appendChild(x.getCard())
            })
        }
    }
    table = new Table(document.getElementById('table'));
})()
table.init();
table.createCard()
table.createCard()
table.render()