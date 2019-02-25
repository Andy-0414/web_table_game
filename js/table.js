var table;

(() => {
    class Prop {
        constructor(option,x,y) {
            option = option || {style:{}}
            option.style = option.style || {}
            this.option = {
                class: option.class || 'card',
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
                    boxShadow: "drop-shadow(0px 1px 1px #00000055)",
                    backgroundColor: option.style.backgroundColor || "",
                    borderRadius: option.style.borderRadius || 0
                },
                transform: {
                    translateY: 0,
                    scale: 1,
                }
            }
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

            this.x = x || 0
            this.y = y || 0

            this.zIndex = 0;

            this.centerX = this.option.width / 2
            this.centerY = this.option.height / 2

            this.prop.style.left = this.x
            this.prop.style.top = this.y

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
        setZindex(num){
            this.zIndex = num
            this.prop.style.zIndex = this.zIndex
        }
        decreaseZindex(){
            if(this.zIndex > 0) this.zIndex--
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
            rotateY(${this.option.reverse ? 180 : 0}deg) `
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

        reverse() {
            this.option.reverse = !this.option.reverse
            this.prop.style.backgroundImage = `url('${this.option.reverse ? this.option.back.image :  this.option.front.image}')`
            this.setTransform()
        }

        getProp() {
            return this.prop
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
            var down = (e)=> {
                if (e.target.classList.contains('prop') || e.target.classList.contains('props')) {
                    this.prop = e.target
                    this.props.forEach((x,idx)=>{
                        x.decreaseZindex()
                    })
                    this.prop.controller.attach()
                }
            }
            var up = (e)=> {
                if (this.prop){
                    this.prop.controller.detach()
                    this.prop = null
                }
            }
            var move=(e)=> {
                this.cursorX = e.clientX
                this.cursorY = e.clientY
                if (this.prop) {
                    this.prop.controller.setPos(this.cursorX, this.cursorY)
                }
            }

            this.table.addEventListener('mousedown', down)
            this.table.addEventListener('mouseup', up)
            this.table.addEventListener('mousemove', move)
        }
        createObject(option,spawnX,spawnY) {
            this.props.push(new Prop(option, spawnX, spawnY));
        }
        createObjects(option,count,spawnX,spawnY){
            for(let i = 0; i < count; i++){
                this.props.push(new Prop(option,spawnX,spawnY));
            }
        }
        render() {
            this.props.forEach(x => {
                this.table.appendChild(x.getProp())
            })
        }
    }
    table = new Table(document.getElementById('table'));
})()
table.init();
table.createObject({
    front: {
        image: "./assets/cards/ace_of_spades.png"
    },
    style: {
        backgroundColor: "white",
        borderRadius: 5
    }
},100,200)
table.createObject({
    front: {
        image: "./assets/cards/king_of_spades.png"
    },
    style: {
        backgroundColor: "white",
        borderRadius: 5
    }
},200,200)
table.createObject({
    front: {
        image: "./assets/cards/queen_of_spades.png"
    },
    style: {
        backgroundColor: "white",
        borderRadius: 5
    }
},300,200)
table.createObject({
    front: {
        image: "./assets/cards/jack_of_spades.png"
    },
    style: {
        backgroundColor: "white",
        borderRadius: 5
    }
},400,200)
table.createObject({
    front: {
        image: "./assets/cards/10_of_spades.png"
    },
    style: {
        backgroundColor: "white",
        borderRadius: 5
    }
},500,200)
table.createObject({
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
table.createObject({
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
table.createObject({
    class: 'coin',
    width: 286,
    height: 397,
    front: {
        image: "./assets/hearth.png"
    },
    back: {
        image: "./assets/hearth2.png"
    },
}, 1000, 600)
table.createObjects({
    class: 'coin',
    width: 100,
    height: 100,
    front: {
        image: "./assets/chip.png"
    },
    back: {
        image: "./assets/chip.png"
    },
}, 10,400,400)
table.render()