var table;

(() => {
    class MoveAbleProp {
        constructor(option, x, y) {
            option = option || { style: {} }
            option.style = option.style || {}
            this.option = {
                class: option.class || 'card',
                width: option.width || 200,
                height: option.height || 300,
                reverse: option.reverse || false,
                front: option.front || {
                    image: './assets/cards/back.png'
                },
                back: option.back || {
                    image: './assets/cards/back.png'
                },
                style: {
                    cursor: "grab",
                    boxShadow: "drop-shadow(0px 1px 1px #00000055)",
                    backgroundColor: option.style.backgroundColor || "",
                    borderRadius: option.style.borderRadius || 0
                },
                transform: {
                    translateY: 0,
                    scale: 1,
                }
            }

            this.x = x || 0
            this.y = y || 0

            this.zIndex = 0

            this.centerX = this.option.width / 2
            this.centerY = this.option.height / 2
        }
        init() {
            this.setPosition()
            this.setStyle()
            this.setTransform()
            this.detach()
        }
        attach() {
            this.option.style.boxShadow = "drop-shadow(0px 20px 1px #00000055)"
            this.option.style.cursor = "grabbing"

            this.option.transform.translateY = 20
            this.setZindex(100)
            this.setStyle()
            this.setTransform()
        }
        detach() {
            this.option.style.boxShadow = "drop-shadow(0px 1px 1px #00000055)"
            this.option.style.cursor = "grab"

            this.option.transform.translateY = 0
            this.setStyle()
            this.setTransform()
        }
        setPosition() {
            this.prop.style.left = (this.x - this.centerX) + "px"
            this.prop.style.top = (this.y - this.centerY) + "px"
        }
        setPos(x, y) {
            this.x = x
            this.y = y
            this.setPosition()
        }
        setZindex(num) {
            this.zIndex = num
            this.prop.style.zIndex = this.zIndex
        }
        decreaseZindex() {
            if (this.zIndex > 0) this.zIndex--
            this.prop.style.zIndex = this.zIndex
        }
        setStyle() {
            this.prop.style.filter = this.option.style.boxShadow
            this.prop.style.cursor = this.option.style.cursor
            this.prop.style.backgroundColor = this.option.style.backgroundColor
            this.prop.style.borderRadius = this.option.style.borderRadius + "px"
        }
        setTransform() {
            this.prop.style.transform = `
            translateY(-${this.option.transform.translateY}px) 
            scale(${this.option.transform.scale}) 
            rotateY(${this.option.reverse ? 180 : 0}deg) 
            scaleX(${this.option.reverse ? -1 : 1})`
        }
        getElement() {
            return this.prop
        }
    }
    class Prop extends MoveAbleProp {
        constructor(option, x, y) {
            super(option, x, y)

            this.prop = document.createElement('div')
            this.prop.className = 'prop'
            this.prop.draggable = false
            this.prop.controller = this

            this.prop.style.width = this.option.width + "px"
            this.prop.style.height = this.option.height + "px"
            this.prop.style.backgroundImage = `url('${this.option.reverse ? this.option.back.image : this.option.front.image}')`
            this.prop.style.backgroundPosition = 'center'
            this.prop.style.backgroundSize = 'contain'

            this.prop.addEventListener('contextmenu', () => {
                this.reverse()
            })

            this.prop.style.left = this.x
            this.prop.style.top = this.y

            this.init()
        }
        reverse() {
            this.option.reverse = !this.option.reverse
            this.prop.style.backgroundImage = `url('${this.option.reverse ? this.option.back.image : this.option.front.image}')`
            this.setTransform()
        }
    }
    class Props extends MoveAbleProp {
        constructor(option, count, x, y) {
            super(option, x, y)
            option.stack = option.stack || []
            console.log(option.stack)
            this.stack = (option.stack.length > 0 ? option.stack.map((e) => new Prop(e)) : null) || [...Array(count).keys()].map(() => new Prop(option))

            this.prop = document.createElement('div')
            this.prop.className = 'props'
            this.prop.draggable = false
            this.prop.controller = this

            this.prop.style.left = this.x
            this.prop.style.top = this.y

            this.prop.style.width = this.option.width + "px"
            this.prop.style.height = this.option.height + "px"
            this.prop.style.backgroundPosition = 'center'
            this.prop.style.backgroundSize = 'contain'

            this.setState()
            this.init()
        }
        setState() {
            if (!this.stack.length) return;
            var con = this.stack[this.stack.length - 1]
            this.prop.style.backgroundImage = `url('${con.option.reverse ? con.option.back.image : con.option.front.image}')`
            this.option.style.backgroundColor = `${con.option.style.backgroundColor}`
            this.prop.innerText = ` x${this.stack.length}`
        }
        popProp() {
            var con = this.stack.pop()
            console.log(con)
            con.setPos(this.x, this.y)
            this.setState()
            return con.getElement()
        }
        pushProp(prop) {
            this.setState()
        }

        chkStack() {
            return this.stack.length <= 0
        }
    }

    class Table {
        constructor(table) {
            this.table = table

            this.props = []
            this.prop = null

            this.cursorX;
            this.cursorY;
        }
        init() {
            this.table.addEventListener('mousedown', (e) => {
                var moveProp = (prop) => {
                    this.prop = prop
                    this.props.forEach((x, idx) => {
                        x.decreaseZindex()
                    })
                    this.prop.controller.attach()
                }
                var target = e.target
                if (target.classList.contains('props')) {
                    switch (e.which) {
                        case 3:
                            moveProp(target)
                            break;
                        case 1:
                            var ele = target.controller.popProp()
                            this.appendTable(ele)
                            moveProp(ele)
                            if (target.controller.chkStack()) {
                                this.removeTable(target)
                            }
                            break;
                    }
                }
                else if (target.classList.contains('prop')) {
                    moveProp(target)
                }
            })
            this.table.addEventListener('mouseup', (e) => {
                if (this.prop) {
                    this.prop.controller.detach()
                    this.prop = null
                }
            })
            this.table.addEventListener('mousemove', (e) => {
                this.cursorX = e.clientX
                this.cursorY = e.clientY
                if (this.prop) {
                    this.prop.controller.setPos(this.cursorX, this.cursorY)
                }
            })
        }
        createProp(option, spawnX, spawnY) {
            var prop = new Prop(option, spawnX, spawnY)
            this.props.push(prop);
            return prop
        }
        createProps(option, count, spawnX, spawnY) {
            var prop = new Props(option, count, spawnX, spawnY)
            this.props.push(prop)
            return prop
        }
        render() {
            this.props.forEach(x => {
                this.table.appendChild(x.getElement())
            })
        }
        appendTable(ele) {
            this.props.push(ele.controller)
            this.table.appendChild(ele)
        }
        removeTable(ele) {
            this.props.splice(ele.controller, 1)
            this.table.removeChild(ele)
        }
    }
    table = new Table(document.getElementById('table'));
})()
table.init();
table.createProps({
    stack: [
        {
            class: 'card',
            front: {
                image: "./assets/cards/ace_of_spades.png"
            },
            style: {
                backgroundColor: "white",
                borderRadius: 5
            }
        },
        {
            class: 'card',
            front: {
                image: "./assets/cards/king_of_spades.png"
            },
            style: {
                backgroundColor: "white",
                borderRadius: 5
            }
        },
        {
            class: 'card',
            front: {
                image: "./assets/cards/queen_of_spades.png"
            },
            style: {
                backgroundColor: "white",
                borderRadius: 5
            }
        },
        {
            class: 'card',
            front: {
                image: "./assets/cards/jack_of_spades.png"
            },
            style: {
                backgroundColor: "white",
                borderRadius: 5
            }
        },
        {
            class: 'card',
            front: {
                image: "./assets/cards/10_of_spades.png"
            },
            style: {
                backgroundColor: "white",
                borderRadius: 5
            }
        }
    ]
},null,200,200)

table.createProp({
    class: 'coin',
    width: 100,
    height: 100,
    front: {
        image: "./assets/coin.png"
    },
    back: {
        image: "./assets/coin.png"
    },
}, 600, 600)
table.createProp({
    class: 'coin',
    width: 100,
    height: 100,
    front: {
        image: "./assets/coin.png"
    },
    back: {
        image: "./assets/coin.png"
    },
}, 800, 600)
table.createProps({
    class: 'card',
    width: 286,
    height: 397,
    reverse: false,
    front: {
        image: "./assets/hearth.png"
    },
    back: {
        image: "./assets/hearth2.png"
    },
}, 5, 1000, 600)
table.createProps({
    class: 'coin',
    width: 100,
    height: 100,
    front: {
        image: "./assets/chip.png"
    },
    back: {
        image: "./assets/chip.png"
    },
}, 10, 400, 400)
table.render()