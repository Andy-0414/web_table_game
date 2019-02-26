
var socket = io();

class MoveAbleProp {
    constructor(id, option, x, y) {
        this.optionSetting(option)
        this._id = id

        this.x = x || 0
        this.y = y || 0

        this.zIndex = 0

        this.active = false;

        this.centerX = this.option.width / 2
        this.centerY = this.option.height / 2
    }
    static defaultOptionFilter(option) {
        option = option || { style: {} }
        option.style = option.style || {}
        return {
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
    }
    optionSetting(option) {
        this.option = MoveAbleProp.defaultOptionFilter(option)
        this.active = option.active
        this.x = option.x
        this.y = option.y
    }
    render() {
        if (this.active) this.attach()
        else this.detach()

        this.setPosition()
        this.setStyle()
        this.setTransform()
    }
    init() {
        this.render()
        this.detach()
    }
    attach() {
        this.active = true

        this.option.style.boxShadow = "drop-shadow(0px 20px 1px #00000055)"
        this.option.style.cursor = "grabbing"

        this.option.transform.translateY = 20
        this.setZindex(100)
        this.setStyle()
        this.setTransform()
    }
    detach() {
        this.active = false

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
    isActive() {
        return this.active
    }
}
class Prop extends MoveAbleProp {
    constructor(id, option, x, y) {
        super(id, option, x, y)

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
    optionSetting(option) {
        super.optionSetting(option)
        if (option) {
            this.option.reverse = option.reverse
        }
        else {
        }
    }
    reverse() {
        socket.emit('reverse', {
            _id: this._id,
            reverse: this.option.reverse
        })
        this.reverseToClient()
    }
    reverseToClient(arg) {
        if (arg) this.option.reverse = arg
        else this.option.reverse = !this.option.reverse
        this.prop.style.backgroundImage = `url('${this.option.reverse ? this.option.back.image : this.option.front.image}')`
        this.setTransform()
    }
}
class Props extends MoveAbleProp {
    constructor(id, option, count, x, y) {
        super(id, option, x, y)
        option.stack = option.stack || []
        this.stack = (option.stack.length > 0 ? option.stack.map((e, idx) => MoveAbleProp.defaultOptionFilter(e)) : null)
            || [...Array(count).keys()].map((e, idx) => MoveAbleProp.defaultOptionFilter(option))


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

        this.childNumber = 0;

        this.setState()
        this.init()
    }
    setStack(stack){
        this.stack = stack
        this.setState()
    }
    setState() {
        if (!this.stack.length) return;
        var con = this.stack[this.stack.length - 1]
        console.log(con.front)
        this.prop.style.backgroundImage = `url('${con.reverse ? con.back.image : con.front.image}')`
        this.option.style.backgroundColor = `${con.style.backgroundColor}`
        this.prop.innerText = ` x${this.stack.length}`
        this.prop.style.borderRadius = con.style.borderRadius + "px"
    }
    popProp() {
        var popData = this.stack.pop()
        var con = new Prop(`${this._id}.${this.childNumber++}`,popData)
        con.setPos(this.x, this.y)
        this.setState()
        return con
    }
    pushProp(prop) {
        this.stack.push(prop)
        this.setState()
    }
    shuffleStack() {
        var len = this.stack.length
        this.stack.forEach((x, idx) => {
            var rand = Math.floor(Math.random() * (len + 1))
            var tmp = this.stack[idx]
            this.stack[idx] = this.stack[rand]
            this.stack[rand] = tmp
        })
    }
    chkStack() {
        return this.stack.length <= 0
    }
}

class TableTop {
    constructor(table) {
        this.table = table

        this.props = []
        this.prop = null

        this.cursorX;
        this.cursorY;

        this.currentId = 0;

        this.networtInit()
    }
    init() {
        this.table.addEventListener('mousedown', (e) => {
            var moveProp = (prop) => {
                if (!prop.controller.isActive()) {
                    this.prop = prop
                    this.props.forEach((x, idx) => {
                        x.decreaseZindex()
                    })
                    this.prop.controller.attach()
                    socket.emit('changeProp', TableTop.compressPropData(this.prop.controller))
                }
            }
            var target = e.target
            if (target.classList.contains('props')) {
                switch (e.which) {
                    case 3:
                        moveProp(target)
                        break;
                    case 1:
                        var data = target.controller.popProp()
                        moveProp(this.createProp(data.option, data.x, data.y).prop);
                        socket.emit('changeProp', TableTop.compressPropData(target.controller))
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
                socket.emit('changeProp', TableTop.compressPropData(this.prop.controller))
                this.prop = null
            }
        })
        this.table.addEventListener('mousemove', (e) => {
            this.cursorX = e.clientX
            this.cursorY = e.clientY
            if (this.prop) {
                this.prop.controller.setPos(this.cursorX, this.cursorY)
                socket.emit('changeProp', TableTop.compressPropData(this.prop.controller))
            }
        })
    }
    createProp(option, spawnX, spawnY) {
        socket.emit('createProp', { option, spawnX, spawnY })
        return this.createPropToClient(option, spawnX, spawnX)
    }
    createPropToClient(option, spawnX, spawnY) {
        var prop = new Prop(this.currentId++, option, spawnX, spawnY)
        this.props.push(prop);
        this.appendTable(prop.getElement())
        return prop
    }
    createProps(option, count, spawnX, spawnY) {
        socket.emit('createProps', { option, count, spawnX, spawnY })
        return this.createPropsToClient(option, count, spawnX, spawnX)
    }
    createPropsToClient(option, count, spawnX, spawnY) {
        var prop = new Props(this.currentId++, option, count, spawnX, spawnY)
        this.props.push(prop)
        this.appendTable(prop.getElement())
        return prop
    }
    appendTable(ele) {
        var con = ele.controller
        this.props.push(con)
        this.table.appendChild(ele)
    }
    removeTable(ele) {
        this.props.splice(ele.controller, 1)
        this.table.removeChild(ele)
    }

    static compressPropData(prop) {
        return {
            _id: prop._id,
            active: prop.active,
            x: prop.x,
            y: prop.y,
            option: prop.option,
            stack: prop.stack || null
        }
    }
    networtInit() {
        var getTarget = (id) => this.props[this.props.findIndex(x => x._id == id)]
        socket.on('createProp', data => {
            table.createPropToClient(data.option, data.spawnX, data.spawnY)
        })
        socket.on('createProps', data => {
            table.createPropsToClient(data.option, data.count || null, data.spawnX, data.spawnY)
        })
        socket.on('reverse', data => {
            var target = getTarget(data._id)
            if (!target) return
            target.reverseToClient()
        })
        socket.on('changeProp', data => {
            var target = getTarget(data._id)
            if (!target) return
            data.option.active = data.active
            data.option.x = data.x
            data.option.y = data.y
            target.optionSetting(data.option)
            if(target.stack){
                target.setStack(data.stack)
            }
            target.render()
        })
        socket.on('changeProps', data => {

        })
    }
}