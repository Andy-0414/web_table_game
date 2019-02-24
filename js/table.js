var table;

(() => {
    class Card {
        constructor(option,x,y) {
            option = option || {style:{}}
            this.option = {
                width: option.width || 200,
                height: option.height || 300,
                reverse: option.reverse || true,
                front: option.front || {
                    image: './assets/cards/black_joker.png'
                },
                back: option.back || {
                    image: './assets/cards/back.png'
                },
                style: {
                    cursor: "grab",
                    boxShadow: "drop-shadow(0px 0px 1px #00000055)",
                    backgroundColor: option.style.backgroundColor || "",
                    borderRadius: option.style.borderRadius || 0
                },
                transform: {
                    translateY: 0,
                    scale: 1,
                }
            }
            this.card = document.createElement('div')
            this.card.className = 'card'
            this.card.draggable = false
            this.card.controller = this

            this.card.style.width = this.option.width + "px"
            this.card.style.height = this.option.height + "px"
            this.card.style.backgroundImage = `url('${this.option.reverse ? this.option.back.image : this.option.front.image}')`
            this.card.style.backgroundPosition = 'center'
            this.card.style.backgroundSize = 'contain'

            this.card.addEventListener('contextmenu', () => {
                this.reverse()
            })

            this.x = x || 0
            this.y = y || 0

            this.zIndex = 0;

            this.centerX = this.option.width / 2
            this.centerY = this.option.height / 2

            this.card.style.left = this.x
            this.card.style.top = this.y

            this.setPosition()
            this.setStyle()
            this.setTransform()

            this.detach()
        }
        attach() {
            this.option.style.boxShadow = "drop-shadow(0px 20px 1px #00000055)"
            this.option.style.cursor = "grabbing"

            this.setZindex(20)
            this.setStyle()
            this.setTransform()
        }
        detach() {
            this.option.style.boxShadow = "drop-shadow(0px 5px 1px #00000055)"
            this.option.style.cursor = "grab"

            this.setZindex(0)
            this.setStyle()
            this.setTransform()
        }
        setZindex(num){
            this.zIndex = num
            this.card.style.zIndex = this.zIndex
            this.option.transform.translateY = this.zIndex
        }
        setStyle() {
            this.card.style.filter = this.option.style.boxShadow
            this.card.style.cursor = this.option.style.cursor
            this.card.style.backgroundColor = this.option.style.backgroundColor
            this.card.style.borderRadius = this.option.style.borderRadius + "px"
        }
        setTransform() {
            this.card.style.transform = `
            translateY(-${this.option.transform.translateY}px) 
            scale(${this.option.transform.scale}) 
            rotateY(${this.option.reverse ? 180 : 0}deg) `
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

        reverse() {
            this.option.reverse = !this.option.reverse
            this.card.style.backgroundImage = `url('${this.option.reverse ? this.option.back.image :  this.option.front.image}')`
            this.setTransform()
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
                if (e.target.classList.contains('card')) {
                    this.card = e.target
                    this.card.controller.attach()
                }
            }
            function up(e) {
                if (this.card) this.card.controller.detach()
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
        createCard(option,spawnX,spawnY) {
            this.cards.push(new Card(option, spawnX, spawnY));
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
table.createCard({
    front: {
        image: "./assets/cards/ace_of_spades.png"
    },
    style: {
        backgroundColor: "white",
        borderRadius: 5
    }
},100,200)
table.createCard({
    front: {
        image: "./assets/cards/king_of_spades.png"
    },
    style: {
        backgroundColor: "white",
        borderRadius: 5
    }
},200,200)
table.createCard({
    front: {
        image: "./assets/cards/queen_of_spades.png"
    },
    style: {
        backgroundColor: "white",
        borderRadius: 5
    }
},300,200)
table.createCard({
    front: {
        image: "./assets/cards/jack_of_spades.png"
    },
    style: {
        backgroundColor: "white",
        borderRadius: 5
    }
},400,200)
table.createCard({
    front: {
        image: "./assets/cards/10_of_spades.png"
    },
    style: {
        backgroundColor: "white",
        borderRadius: 5
    }
},500,200)
table.render()